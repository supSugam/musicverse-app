import { View, Pressable } from 'react-native';
import React, { useContext, useEffect } from 'react';
import LogoWithName from '../reusables/LogoWithName';
import StyledText from '../reusables/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { Image } from 'expo-image';
import COLORS from '@/constants/Colors';
import { CommonActions, Link, useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import { useAppSidebar } from '../Sidebar/AppSidebar';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';

const NavBar = ({ title = 'NavBar' }: { title?: string | React.ReactNode }) => {
  const { currentUserProfile, setCurrentUserProfile } = useAuthStore(
    (state) => state
  );
  const navigation = useNavigation();
  const route = useRoute();

  const {
    get: { data: profileData },
  } = useProfileQuery();

  useEffect(() => {
    console.log('profileData', profileData);
    // if(profileData){
    //   setCurrentUserProfile(profileData?.data?.result);
    // }
  }, [profileData]);

  const { toggleAppSidebar } = useAppSidebar();
  return (
    <View
      style={{
        height: 65,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral.dark,
        shadowColor: COLORS.primary.light,
        shadowOffset: { width: 0, height: 100 },
        shadowOpacity: 0.6,
        shadowRadius: 50,
        elevation: 100,
      }}
      className="relative"
    >
      <View
        className="flex flex-row items-center"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 2,
          marginHorizontal: 10,
        }}
      >
        <LogoWithName
          width={44}
          height={44}
          title={
            typeof title === 'string' ? (
              <StyledText weight="extrabold" tracking="tight" size="2xl">
                {title}
              </StyledText>
            ) : (
              title
            )
          }
        />
        <View className="flex flex-row items-center">
          <Ionicons
            name="notifications"
            size={24}
            color="white"
            style={{ marginRight: 12 }}
          />

          <AnimatedTouchable
            onPress={toggleAppSidebar}
            wrapperStyles={{
              borderColor: COLORS.neutral.normal,
              borderWidth: 1,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Image
              source={
                currentUserProfile?.avatar ||
                require('@/assets/images/avatar.jpeg')
              }
              style={{ width: 34, height: 34 }}
            />
          </AnimatedTouchable>
        </View>
      </View>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.35)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.7)',
          'rgba(0, 0, 0, 0.8)',
          'rgba(0, 0, 0, 0.9)',
        ]}
        start={[0, 0]}
        end={[0, 1]}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
        }}
      />
    </View>
  );
};

export default NavBar;
