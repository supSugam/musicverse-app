import { View } from 'react-native';
import { useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';

// import useDatePicker from '@/hooks/useDatePicker';
import SelectOption from '@/components/reusables/SelectOption';
import { useGenreQuery } from '@/hooks/react-query/useGenreQuery';
import { useTagsQuery } from '@/hooks/react-query/useTagsQuery';
import { toastResponseMessage } from '@/utils/toast';
import Switch from '@/components/reusables/StyledSwitch';
const AlbumDetailsSC2 = ({ navigation }: { navigation: any }) => {
  const { album, setAlbum } = useUploadStore((state) => state);

  const [loading, setLoading] = useState<boolean>(false);
  const [requestPublicUpload, setRequestPublicUpload] =
    useState<boolean>(false);

  // const {
  //   date,
  //   showDatePicker,
  //   hideDatePicker,
  //   renderDatePicker,
  //   formattedDate,
  // } = useDatePicker();

  const [selectedGenre, setSelectedGenre] = useState<string[]>([]);
  const onSelectedGenreChange = (selected: string[]) => {
    setSelectedGenre(selected as string[]);
  };

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onSelectedTagsChange = (selected: string[]) => {
    setSelectedTags(selected as string[]);
  };

  const { genres } = useGenreQuery();
  const { tags } = useTagsQuery();

  const handleSubmit = () => {
    setLoading(true);
    console.log(album?.title, 'album');
    if (!album?.title) {
      toastResponseMessage({
        type: 'error',
        content: 'Please fill in required details first',
      });
      navigation.navigate('AlbumDetailsSC1');
      setLoading(false);
      return;
    }

    // if (!date) {
    //   toastResponseMessage({
    //     type: 'error',
    //     content: 'Please select a date of release',
    //   });
    //   setLoading(false);
    //   return;
    // }
    if (selectedGenre.length === 0) {
      toastResponseMessage({
        type: 'error',
        content: 'Please select a genre',
      });
      setLoading(false);
      return;
    }
    const genre = genres.find((g) => g.name === selectedGenre[0])?.id;

    setAlbum({
      ...album,
      ...(selectedGenre.length > 0 && { genreId: genre }),
      ...(selectedTags.length > 0 && { tags: selectedTags }),
    });
    setLoading(false);
    navigation.navigate('TracksUploadZone');
  };

  return (
    <View className="flex-1">
      <View className="flex justify-between items-center mt-8 px-6">
        <StyledText weight="extrabold" size="2xl">
          Just a few more details
        </StyledText>
        <StyledText
          weight="extralight"
          size="xs"
          className="mt-2 text-gray-400 text-center"
          uppercase
        >
          This is 2nd and last step of filling in the details of your album
        </StyledText>
      </View>

      <View className="flex flex-col px-4 mt-6 w-full">
        {/* <StyledText
          weight="bold"
          size="lg"
          className="border-b w-full text-center my-3 pb-2"
          onPress={showDatePicker}
          style={{
            borderColor: '#ffffff60',
          }}
        >
          {`Date of Release: ${formattedDate}`}
        </StyledText> */}

        {/* {renderDatePicker()} */}

        <SelectOption
          options={genres.map((genre) => genre.name)}
          placeholder="Select Genre"
          selected={selectedGenre}
          onChange={onSelectedGenreChange}
          single
          minSelection={1}
          maxSelection={1}
        />

        <SelectOption
          options={tags.map((tag) => tag.name)}
          placeholder="Select Tags (Optional, Max 3)"
          selected={selectedTags}
          onChange={onSelectedTagsChange}
          minSelection={0}
          maxSelection={3}
        />
        <Switch
          value={requestPublicUpload}
          onToggle={setRequestPublicUpload}
          label="Request Public Upload"
          className="mt-2"
        />
      </View>

      <View className="flex-1 p-4">
        <StyledButton
          variant="primary"
          className="mt-auto mb-2"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        >
          <StyledText weight="bold" size="lg">
            Continue
          </StyledText>
        </StyledButton>
      </View>
    </View>
  );
};

export default AlbumDetailsSC2;
