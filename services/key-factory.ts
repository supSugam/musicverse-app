// key-factory.ts for react-query // react-native

// export const tracksKeyFactory = {
//   getTracks: () => ['tracks'],
//   getTrack: (id: number) => ['tracks', id],
//   createTrack: () => ['tracks'],
//   updateTrack: (id: number) => ['tracks', id],
//   deleteTrack: (id: number) => ['tracks', id],
//   getTrackComments: (id: number) => ['tracks', id, 'comments'],
//   createTrackComment: (id: number) => ['tracks', id, 'comments'],
//   updateTrackComment: (id: number, commentId: number) => [
//     'tracks',
//     id,
//     'comments',
//     commentId,
//   ],
//   deleteTrackComment: (id: number, commentId: number) => [
//     'tracks',
//     id,
//     'comments',
//     commentId,
//   ],
// };

export const USER_QUERY_KEY = 'user';
export const PROFILE_QUERY_KEY = (...args: (string | undefined)[]) => [
  USER_QUERY_KEY,
  'profile',
  ...args,
];

export const profileKeyFactory = {
  getProfileByUsername: (username?: string) => PROFILE_QUERY_KEY(username),
};
export const GENRES_QUERY_KEY = 'genres';
export const TAGS_QUERY_KEY = 'tags';
export const ALBUM_QUERY_KEY = 'albums';

export const albumKeyFactory = {
  getAlbums: () => [ALBUM_QUERY_KEY],
  getAlbum: (id: string) => [ALBUM_QUERY_KEY, id],
  createAlbum: () => [ALBUM_QUERY_KEY],
  updateAlbum: (id?: string) => [ALBUM_QUERY_KEY, ...(id ? [id] : [])],
  deleteAlbum: (id?: string) => [ALBUM_QUERY_KEY, ...(id ? [id] : [])],
};
export const TRACK_QUERY_KEY = 'tracks' as const;

export const trackKeyFactory = {
  getTracks: () => [TRACK_QUERY_KEY],
  getTrack: (id: string) => [TRACK_QUERY_KEY, id],
  createTrack: () => [TRACK_QUERY_KEY],
  updateTrack: (id: string) => [TRACK_QUERY_KEY, id],
  deleteTrack: (id?: string) => [TRACK_QUERY_KEY, ...(id ? [id] : [])],
  toggleLike: (id?: string) => [TRACK_QUERY_KEY, ...(id ? [id] : [])],
};

export const PLAYLIST_QUERY_KEY = 'playlists' as const;

export const playlistKeyFactory = {
  getPlaylists: () => [PLAYLIST_QUERY_KEY],
  getPlaylist: (id: string) => [PLAYLIST_QUERY_KEY, id],
  createPlaylist: () => [PLAYLIST_QUERY_KEY],
  updatePlaylist: (id?: string) => [PLAYLIST_QUERY_KEY, ...(id ? [id] : [])],
  deletePlaylist: (id?: string) => [PLAYLIST_QUERY_KEY, ...(id ? [id] : [])],
  toggleSave: (id?: string) => [PLAYLIST_QUERY_KEY, ...(id ? [id] : [])],
};

export const FOLLOWERS_QUERY_KEY = 'followers' as const;
