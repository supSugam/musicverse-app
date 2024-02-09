export interface ITrack {
  id: string;
  title: string;
  description?: string;
  src: string;
  preview?: string;
  cover?: string;
  lyrics?: string;
  genreId: string;
  tags?: string[];
}
