// app/tabs/home/HomeScreen.tsx
import Container from '@/components/Container';
import NavBar from '@/components/home/NavBar';
import StyledText from '@/components/reusables/StyledText';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { toastResponseMessage } from '@/utils/toast';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HomeScreen: React.FC = () => {
  const { currentUser } = useAuthStore((state) => state);

  return (
    <Container>
      <NavBar />
      <ScrollView style={styles.scrollView}>
        <View>
          <StyledText size="3xl" weight="bold" tracking="tighter">
            Welcome back, {currentUser?.username}
          </StyledText>
        </View>
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 15,
  },
});
