// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import TrackListItem from '@/components/Tracks/TrackListItem';
import GenreScrollView from '@/components/home/GenreScrollView';
import StyledText from '@/components/reusables/StyledText';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTracksQuery } from '@/hooks/react-query/useTracksQuery';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const ProfilePage: React.FC = () => {
  const { params } = useRoute();
  console.log(params);

  return (
    <Container includeNavBar navbarTitle="Home">
      <ScrollView style={styles.scrollView}>
        <View>
          <StyledText>Profile Page</StyledText>
        </View>
      </ScrollView>
    </Container>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
});
