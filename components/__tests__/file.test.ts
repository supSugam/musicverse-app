import {
  getFileInfoFromUri,
  assetToFile,
  imageAssetToFile,
} from '../../utils/helpers/file';

test('getFileInfoFromUri', () => {
  const uri = 'https://example.com/folder/file.jpg';
  const fileInfo = getFileInfoFromUri(uri);
  expect(fileInfo.name).toBe('file');
  expect(fileInfo.extension).toBe('jpg');
  expect(fileInfo.originalFilename).toBe('file.jpg');
});

describe('assetToFile', () => {
  test('should return null when asset is null', () => {
    expect(assetToFile(null)).toBeNull();
  });

  test('should convert AssetWithDuration to IFilePayload', () => {
    const asset = { uri: 'file://example.jpg', mimeType: 'image/jpeg' };
    const filePayload = assetToFile(asset as any);
    expect(filePayload).toEqual({
      uri: 'file://example.jpg',
      name: 'example.jpg',
      type: 'image/jpeg',
    });
  });
});

describe('imageAssetToFile', () => {
  test('should return null when asset is null', () => {
    expect(imageAssetToFile(null)).toBeNull();
  });

  test('should convert ImagePickerAsset to IFilePayload', () => {
    const asset = { uri: 'file://example.jpg', type: 'image/jpeg' };
    const filePayload = imageAssetToFile(asset as any);
    expect(filePayload).toEqual({
      uri: 'file://example.jpg',
      name: 'example.jpg',
      type: 'image/jpeg',
    });
  });
});
