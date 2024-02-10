// import useScreenDimensions from '@/hooks/useScreenDimensions';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   Platform,
//   StatusBar,
// } from 'react-native';
// type ContainerProps = {
//   children: React.ReactNode;
//   scrollable?: boolean;
// };

// const TabBarSafeView = ({ children, scrollable }: ContainerProps) => {
//   const { SCREEN_HEIGHT } = useScreenDimensions();
//   const component = scrollable ? 'ScrollView' : 'View';
//   const paddingTop =
//     Platform.OS === 'android' ? StatusBar?.currentHeight || 0 : 0;

//   console.log('scrollable', paddingTop);

//   const style = StyleSheet.create({
//     container: {
//       height: SCREEN_HEIGHT * 0.8 - paddingTop,
//     },
//   });
//   return scrollable ? (
//     <ScrollView style={style.container}>{children}</ScrollView>
//   ) : (
//     <View style={style.container}>{children}</View>
//   );
// };

// export default TabBarSafeView;
