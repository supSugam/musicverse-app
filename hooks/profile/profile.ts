import { api } from '@/utils/constants';
import { ICreateUserProfileDTO, IUpdateUserProfileDTO } from './profile.dto';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { PROFILE_QUERY_KEY } from '@/services/key-factory';
import { toastResponseMessage } from '@/utils/toast';

// TODO: Profile Hooks
// Create User Profile
const createUserProfile = async (profileDetails: ICreateUserProfileDTO) => {
  return await api.post('/profile', profileDetails);
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createProfile'],
    mutationFn: createUserProfile,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY(),
      });
      toastResponseMessage({
        content: 'Profile created successfully',
        type: 'success',
      });
    },
    onError: (error) => {
      toastResponseMessage({
        content: error,
        type: 'error',
      });
    },
  });
};

// Get User Profile

const getUserProfileByUserId = async (userId: string) => {
  return await api.get(`/profile/${userId}`);
};

export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId),
    queryFn: () => getUserProfileByUserId(userId),
    refetchOnWindowFocus: true,
  });
};

// Update User Profile

const updateUserProfile = async (profileDetails: IUpdateUserProfileDTO) => {
  return await api.patch('/profile', profileDetails, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
