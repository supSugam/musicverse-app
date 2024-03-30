import Container from '@/components/Container';
import COLORS from '@/constants/Colors';
import { ScrollView, StyleSheet } from 'react-native';
import { RefreshControl, TextInput } from 'react-native-gesture-handler';

const SearchPage = () => {
  return (
    <Container includeNavBar navbarTitle="Search">
      <ScrollView
        style={styles.scrollView}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={}
        //     onRefresh={() => {
        //     }}
        //   />
        // }
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a track"
          placeholderTextColor={COLORS.neutral.light}
          selectionColor="white"
          onChangeText={(text) => {
            console.log(text);
          }}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: COLORS.neutral.semidark,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.neutral.white,
    marginBottom: 15,
    borderColor: `${COLORS.neutral.light}30`,
    borderWidth: 1,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
});

export default SearchPage;
