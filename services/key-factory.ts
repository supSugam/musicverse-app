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
export const GENRES_QUERY_KEY = 'genres';
export const TAGS_QUERY_KEY = 'tags';

export const albumKeyFactory = {
  getAlbums: () => ['albums'],
  getAlbum: (id: string) => ['albums', id],
  createAlbum: () => ['albums'],
  updateAlbum: (id: string) => ['albums', id],
  deleteAlbum: (id: string) => ['albums', id],
  getAlbumTracks: (id: string) => ['albums', id, 'tracks'],
};
