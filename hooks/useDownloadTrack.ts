import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { UserRole } from '@/utils/Interfaces/IUser';
import { Downloaded_Tracks_Paths } from '@/utils/constants';
import { blobToBase64 } from '@/utils/helpers/string';
import { toastResponseMessage } from '@/utils/toast';
import { useTracksQuery } from './react-query/useTracksQuery';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';

const db = SQLite.openDatabase('musicverse.db');

export const useDownloadTrack = (searchTerm?: string) => {
  const [tracks, setTracks] = useState<ITrackDetails[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const { api } = useAuthStore();
  useEffect(() => {
    if (searchTerm) {
      const filteredTracks = tracks.filter((track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTracks(filteredTracks);
    } else {
      loadTracks();
    }
  }, [searchTerm]);

  useEffect(() => {
    const createTables = () => {
      db.transaction((tx) => {
        // Create tracks table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS tracks (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            src TEXT,
            cover TEXT,
            lyrics TEXT,
            publicStatus TEXT,
            trackDuration INTEGER,
            trackSize INTEGER,
            creatorId TEXT,
            plays INTEGER,
            createdAt TEXT,
            downloaded INTEGER DEFAULT 0,
            downloadedAt TEXT,
            FOREIGN KEY(creatorId) REFERENCES users(id)
          )`,
          [],
          () => {
            // console.log('Tracks table created');
          },
          (_, error) => {
            console.error('Failed to create tracks table: ', error);
            return false;
          }
        );

        // Create users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            username TEXT,
            role TEXT,
            isVerified INTEGER
          )`,
          [],
          () => {
            // console.log('Users table created');
          },
          (_, error) => {
            console.error('Failed to create users table: ', error);
            return false;
          }
        );

        // Create user profiles table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS userProfiles (
            id TEXT PRIMARY KEY,
            userId TEXT,
            name TEXT,
            avatar TEXT,
            cover TEXT,
            createdAt TEXT,
            FOREIGN KEY(userId) REFERENCES users(id)
          )`,
          [],
          () => {
            loadTracks();
          },
          (_, error) => {
            console.error('Failed to create user profiles table: ', error);
            return false;
          }
        );
      });
    };

    createTables();
  }, []);

  const loadTracks = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT
            t.id,
            t.title,
            t.description,
            t.src,
            t.cover,
            t.lyrics,
            t.publicStatus,
            t.trackDuration,
            t.trackSize,
            t.creatorId,
            t.plays,
            t.createdAt,
            t.downloaded,
            t.downloadedAt,
            u.email AS creatorEmail,
            u.username AS creatorUsername,
            u.role AS creatorRole,
            u.isVerified AS creatorIsVerified,
            p.id AS profileId,
            p.name AS profileName,
            p.avatar AS profileAvatar,
            p.cover AS profileCover,
            p.createdAt AS profileCreatedAt
            FROM tracks t
            INNER JOIN users u ON t.creatorId = u.id
            LEFT JOIN userProfiles p ON u.id = p.userId
            `,
        [],
        (_, { rows }) => {
          const loadedTracks: Partial<ITrackDetails>[] = rows._array.map(
            (row) => ({
              id: row.id,
              title: row.title,
              description: row.description || null,
              src: row.src,
              cover: row.cover || null,
              lyrics: row.lyrics || null,
              publicStatus: row.publicStatus,
              trackDuration: row.trackDuration,
              trackSize: row.trackSize,
              creator: {
                id: row.creatorId,
                email: row.creatorEmail,
                username: row.creatorUsername,
                role: row.creatorRole as UserRole,
                isVerified: !!row.creatorIsVerified,
                profile: row.profileId
                  ? {
                      id: row.profileId,
                      userId: row.creatorId,
                      name: row.profileName,
                      avatar: row.profileAvatar || null,
                      cover: row.profileCover || null,
                      createdAt: row.profileCreatedAt,
                    }
                  : null,
              },
              plays: row.plays || 0,
              createdAt: row.createdAt,
              downloaded: !!row.downloaded,
              downloadedAt: row.downloadedAt || null,
            })
          ) as ITrackDetails[];

          setTracks(loadedTracks as ITrackDetails[]);
        },
        (_, error) => {
          console.error('Failed to load tracks: ', error);
          return false;
        }
      );
    });
  };

  const downloadAndSaveTrack = async (
    track: Partial<ITrackDetails> | string
  ) => {
    try {
      setIsDownloading(true);
      let trackDetails: Partial<ITrackDetails> = {};
      if (typeof track === 'string') {
        await api
          .get(`/tracks/${track}`)
          .then((res) => {
            trackDetails = res.data.result;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        trackDetails = track;
      }

      if (!trackDetails) return;

      if (!trackDetails.id || !trackDetails.src || !trackDetails.creator) {
        setIsDownloading(false);
        return;
      }

      // Request necessary permissions
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } =
          await MediaLibrary.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.log(
            'Permission denied for media library and external storage'
          );
          return;
        }
      }

      // check if directory exists
      const { exists } = await FileSystem.getInfoAsync(
        Downloaded_Tracks_Paths.TRACKS_DIR
      );

      if (!exists) {
        await FileSystem.makeDirectoryAsync(
          Downloaded_Tracks_Paths.TRACKS_DIR,
          { intermediates: true }
        );
      }

      // check if track directory exists
      const { exists: trackDirExists } = await FileSystem.getInfoAsync(
        Downloaded_Tracks_Paths.TRACK_DIR(trackDetails.id)
      );

      if (!trackDirExists) {
        await FileSystem.makeDirectoryAsync(
          Downloaded_Tracks_Paths.TRACK_DIR(trackDetails.id),
          { intermediates: true }
        );
      }

      // Define file paths
      const audioFileExtension = extractExtensionFromUrl(trackDetails.src);
      const audioFileName = `${trackDetails.title}.${audioFileExtension}`;
      const audioFileUri = Downloaded_Tracks_Paths.TRACK_SRC(
        trackDetails.id,
        audioFileName
      );
      const coverFileUri = trackDetails.cover
        ? Downloaded_Tracks_Paths.TRACK_COVER(
            trackDetails.id,
            `trackcover.${extractExtensionFromUrl(trackDetails.cover)}`
          )
        : null;
      const avatarFileUri = trackDetails.creator?.profile?.avatar
        ? Downloaded_Tracks_Paths.TRACK_ARTIST_AVATAR(
            trackDetails.id,
            `artist-avatar.${extractExtensionFromUrl(
              trackDetails.creator.profile.avatar
            )}`
          )
        : null;

      // Download and save audio file
      const audioDownloadResponse = await axios.get(trackDetails.src, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / (progressEvent?.total || 0)) * 100
          );
          setProgressPercentage(progress);
        },
      });
      const audioData = await blobToBase64(audioDownloadResponse.data);
      const audioBase64 = audioData.split(',')[1]; // Extract Base64 string
      await FileSystem.writeAsStringAsync(audioFileUri, audioBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Download and save cover image
      if (coverFileUri) {
        const coverDownloadResponse = await axios.get(
          trackDetails.cover as string,
          {
            responseType: 'blob',
          }
        );
        const coverData = await blobToBase64(coverDownloadResponse.data);
        const coverBase64 = coverData.split(',')[1]; // Extract Base64 string
        await FileSystem.writeAsStringAsync(coverFileUri, coverBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Download and save creator avatar image
      if (avatarFileUri) {
        const avatarDownloadResponse = await axios.get(
          trackDetails.creator!.profile!.avatar!,
          { responseType: 'blob' }
        );
        const avatarData = await blobToBase64(avatarDownloadResponse.data);
        const avatarBase64 = avatarData.split(',')[1]; // Extract Base64 string
        await FileSystem.writeAsStringAsync(avatarFileUri, avatarBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Insert or update creator in the users table
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT OR REPLACE INTO users (id, email, username, role, isVerified) VALUES (?, ?, ?, ?, ?)',
          [
            trackDetails.creator!.id,
            trackDetails.creator!.email,
            trackDetails.creator!.username,
            trackDetails.creator!.role,
            trackDetails.creator!.isVerified ? 1 : 0,
          ],
          () => {
            console.log('User inserted or updated successfully');
          },
          (_, error) => {
            console.error('Failed to insert or update user: ', error);
            return false;
          }
        );
      });

      // Insert or update creator profile in the userProfiles table
      if (trackDetails.creator!.profile) {
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT OR REPLACE INTO userProfiles (id, userId, name, avatar, createdAt) VALUES (?, ?, ?, ?, ?)',
            [
              trackDetails.creator!.profile!.id,
              trackDetails.creator!.id,
              trackDetails.creator!.profile!.name ||
                trackDetails.creator!.username,
              trackDetails.creator!.profile!.avatar || null,
              trackDetails.creator!.profile!.createdAt,
            ],
            () => {
              console.log('User profile inserted or updated successfully');
            },
            (_, error) => {
              console.error('Failed to insert or update user profile: ', error);
              return false;
            }
          );
        });
      }

      // Save track details and file paths to SQLite database
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO tracks (id, title, description, src, cover, lyrics, publicStatus, trackDuration, trackSize, creatorId, plays, createdAt, downloaded, downloadedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)',
          [
            trackDetails.id as string,
            trackDetails.title as string,
            trackDetails.description || '',
            audioFileUri as string,
            coverFileUri || null,
            trackDetails.lyrics || '',
            trackDetails.publicStatus as string,
            trackDetails.trackDuration as number,
            trackDetails.trackSize as number,
            trackDetails.creator!.id,
            trackDetails.plays || 0,
            trackDetails.createdAt as string,
            new Date().toISOString(),
          ],
          () => {
            toastResponseMessage({
              content: 'Song Downloaded',
              type: 'success',
            });

            api.post(`/tracks/download/${trackDetails.id}`);
            loadTracks();
          },
          (_, error) => {
            console.error('Failed to save track: ', error);
            toastResponseMessage({
              content: 'Failed to download song',
              type: 'error',
            });
            return false;
          }
        );
      });
    } catch (error) {
      console.error('Error downloading and saving track:', error);
    } finally {
      setIsDownloading(false);
      setProgressPercentage(0);
    }
  };

  // Helper function to extract extension from URL
  const extractExtensionFromUrl = (url: string) => {
    return url.match(/\.\w+\?/)?.[0].slice(1, -1) || '';
  };

  const isTrackDownloaded = (trackId: string) => {
    return tracks.some((track) => track.id === trackId && track.downloaded);
  };

  const getTrackFilePath = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return null;

    return track.src;
  };

  const deleteTrack = async (trackId: string, showToast = true) => {
    const { exists } = await FileSystem.getInfoAsync(
      Downloaded_Tracks_Paths.TRACK_DIR(trackId)
    );

    if (exists) {
      await FileSystem.deleteAsync(Downloaded_Tracks_Paths.TRACK_DIR(trackId), {
        idempotent: true,
      });
    }

    // Remove track from SQLite database
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tracks WHERE id = ?',
        [trackId],
        () => {
          if (showToast) {
            toastResponseMessage({
              content: 'Song Deleted',
              type: 'success',
            });
          }
          loadTracks();
        },
        (_, error) => {
          toastResponseMessage({
            content: 'Failed to delete song',
            type: 'error',
          });
          console.error('Failed to delete track: ', error);
          return false;
        }
      );
    });
  };

  const deleteAllTracks = async (batch?: string[]) => {
    // Delete all downloaded tracks
    const { exists } = await FileSystem.getInfoAsync(
      Downloaded_Tracks_Paths.TRACKS_DIR
    );

    if (exists) {
      if (batch) {
        batch.forEach(async (trackId) => {
          await FileSystem.deleteAsync(
            Downloaded_Tracks_Paths.TRACK_DIR(trackId),
            {
              idempotent: true,
            }
          );
          deleteTrack(trackId, false);
        });
      } else {
        await FileSystem.deleteAsync(Downloaded_Tracks_Paths.TRACKS_DIR, {
          idempotent: true,
        });

        db.transaction((tx) => {
          tx.executeSql('DELETE FROM tracks', [], () => {});
        });
      }
    }
    loadTracks();
    toastResponseMessage({
      content: 'All Songs Deleted',
      type: 'success',
    });
  };

  return {
    tracks,
    downloadAndSaveTrack,
    deleteTrack,
    progressPercentage,
    isDownloading,
    isTrackDownloaded,
    getTrackFilePath,
    deleteAllTracks,
  };
};
