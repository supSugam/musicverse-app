// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { FeedContentType, IFeedContent } from '@/utils/Interfaces/IFeed';
import PostCard from '@/components/Feed/PostCard';
import { CommonActions } from '@react-navigation/native';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import { ReviewStatus } from '@/utils/enums/ReviewStatus';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import ArtistCard from '@/components/Feed/ArtistCard';
import StyledText from '@/components/reusables/StyledText';
import COLORS from '@/constants/Colors';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';

const Feed: React.FC = () => {
  const navigation = useNavigation();
  const [feedContent, setFeedContent] = useState<IFeedContent[]>([]);
  // Genres
  const {
    getFeedContent: { data: feedContentData, refetch: refetchAllFeedContent },
  } = useFollowQuery();

  const [topArtists, setTopArtists] = useState<IUserWithProfile[]>([]);
  const {
    getMany: { data: usersData },
  } = useProfileQuery({
    getManyUsersConfig: {
      params: {
        artistStatus: ReviewStatus.APPROVED,
        pageSize: 10,
        page: 1,
        sortByPopularity: true,
      },
    },
  });
  useEffect(() => {
    setTopArtists(usersData?.data?.result?.items || []);
  }, [usersData]);

  useEffect(() => {
    const feedData = feedContentData?.data?.result;
    if (feedData) {
      const sortedData: IFeedContent[] = [
        ...feedData.albums,
        ...feedData.playlists,
        ...feedData.tracks,
      ]
        .map((item) => {
          return {
            id: item.id,
            createdAt: item.createdAt,
            creator: item.creator,
            tags: item.tags,
            cover: item?.cover,
            genre: item?.genre,
            type: item?.type as FeedContentType,
          };
        })
        .sort((a, b) => {
          const createdDateA = new Date(a.createdAt);
          const createdDateB = new Date(b.createdAt);
          return createdDateA > createdDateB
            ? -1
            : createdDateA < createdDateB
            ? 1
            : 0;
        });

      setFeedContent(sortedData);
    } else {
      setFeedContent([]);
    }
  }, [feedContentData]);

  const { updateTracks, playATrackById } = usePlayerStore();

  return (
    <Container includeNavBar navbarTitle="Feed">
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              //   refetchAllFeedContent();
            }}
          />
        }
        scrollEnabled
        stickyHeaderIndices={[0]}
      >
        <View
          className="flex flex-col w-full"
          style={{
            paddingVertical: 10,
            backgroundColor: COLORS.neutral.dense,
            paddingHorizontal: 15,
            paddingBottom: 18,
            borderBottomColor: COLORS.neutral.semidark,
            borderBottomWidth: 1,
            marginBottom: 10,
          }}
        >
          <StyledText size="lg" weight="semibold" className="mb-4">
            Popular Artists 🕺
          </StyledText>
          <ScrollView horizontal>
            {[
              ...topArtists,
              ...topArtists,
              ...topArtists,
              ...topArtists,
              ...topArtists,
            ].map((artist, index) => (
              <ArtistCard
                index={index}
                avatar={artist.profile.avatar}
                name={artist.profile.name}
                followers={artist._count?.followers}
                id={artist.id}
                key={artist.id + index}
              />
            ))}
          </ScrollView>
        </View>

        {/* <View
          style={{
            paddingHorizontal: 15,
          }}
          className="flex flex-col"
        ></View> */}

        {feedContent.map((content, index) => (
          <PostCard
            key={content.id}
            {...content}
            index={index}
            onPress={() => {
              switch (content.type) {
                case FeedContentType.ALBUM:
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'AlbumPage',
                      params: {
                        albumId: content.id,
                      },
                    })
                  );
                  break;
                case FeedContentType.PLAYLIST:
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'PlaylistPage',
                      params: {
                        playlistId: content.id,
                      },
                    })
                  );
                  break;
                case FeedContentType.TRACK:
                  const track = feedContentData?.data?.result?.tracks?.find(
                    (track) => track.id === content.id
                  );
                  updateTracks(track ? [track] : []);
                  playATrackById(content.id);
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'TrackPlayer',
                    })
                  );

                  break;
              }
            }}
          />
        ))}

        <View
          className="flex flex-col w-full"
          style={{
            paddingHorizontal: 20,
          }}
        ></View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    maxHeight: '100%',
  },
});

export default Feed;
