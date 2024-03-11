import * as yup from 'yup';
import StyledTextField from './StyledTextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mode, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { debounce } from '@/utils/helpers/debounce';
import { throttle } from '@/utils/helpers/throttle';

const searchSchema = yup.object().shape({
  search: yup.string().nullable(),
});

interface ISearchFieldProps {
  triggerMode?: 'debounce' | 'throttle';
  onSearch: (search: string) => void;
  delay?: number;
  placeholder?: string;
  label?: string;
}

export default function SearchField({
  triggerMode = 'debounce',
  onSearch,
  delay = 500,
  placeholder,
  label,
}: ISearchFieldProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(searchSchema),
  });

  let watchSearch = watch('search');

  const debouncedSearch = useMemo(
    () => debounce((search: string) => onSearch(search), delay),
    [delay, onSearch]
  );

  const throttledSearch = useMemo(
    () => throttle((search: string) => onSearch(search), delay),
    [delay, onSearch]
  );

  useEffect(() => {
    if (watchSearch === null || watchSearch === undefined) return;

    const handleSearch = () => {
      switch (triggerMode) {
        case 'debounce':
          debouncedSearch(watchSearch as string);
          break;
        case 'throttle':
          throttledSearch(watchSearch as string);
          break;
        default:
          break;
      }
    };

    handleSearch();
  }, [watchSearch, triggerMode, debouncedSearch, throttledSearch, onSearch]);

  return (
    <StyledTextField
      control={control}
      rules={{
        required: 'Search is required',
      }}
      controllerName="search"
      label={label}
      placeholder={placeholder}
      errorMessage={errors.search?.message}
      variant="underlined"
      textSize="lg"
      backgroundColor="transparent"
      borderColor="#fff"
      textAlign="left"
      wrapperClassName="mb-3"
    />
  );
}
