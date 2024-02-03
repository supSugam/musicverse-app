// key-factory.ts for react-query // react-native

// export const tracksKeyFactory = {
//   getTracks: () => ['tracks'],
//   getTrack: (id: number) => ['tracks', id],
//   createTrack: () => ['tracks'],
//   updateTrack: (id: number) => ['tracks', id],
//   deleteTrack: (id: number) => ['tracks', id],
//   getTrackComments: (id: number) => ['tracks', id, 'comments'],
//   createTrackComment: (id: number) => ['tracks', id, 'comments'],
//   updateTrackComment: (id: number, commentId: number) => [
//     'tracks',
//     id,
//     'comments',
//     commentId,
//   ],
//   deleteTrackComment: (id: number, commentId: number) => [
//     'tracks',
//     id,
//     'comments',
//     commentId,
//   ],
// };

export const USER_QUERY_KEY = 'user';
export const PROFILE_QUERY_KEY = (...args: string[]) => [
  USER_QUERY_KEY,
  'profile',
  ...args,
];
