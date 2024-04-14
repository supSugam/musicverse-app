// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { FeedContentType, IFeedContent } from '@/utils/Interfaces/IFeed';
import PostCard from '@/components/Feed/PostCard';
import { CommonActions } from '@react-navigation/native';

const Feed: React.FC = () => {
  const navigation = useNavigation();
  const [feedContent, setFeedContent] = useState<IFeedContent[]>([]);
  // Genres
  const {
    getFeedContent: { data: feedContentData, refetch: refetchAllFeedContent },
  } = useFollowQuery();

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
          style={{
            paddingHorizontal: 15,
          }}
          className="flex flex-col"
        ></View>

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
