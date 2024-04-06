// react-native-track-player - service.js

import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import TrackPlayer, { Event } from 'react-native-track-player';
module.exports = async function () {
  const {
    playPause,
    resetPlayer,
    nextTrack,
    prevTrack,
    seek,
    seekForward,
    seekBackward,
  } = usePlayerStore();
  TrackPlayer.addEventListener(Event.RemotePlay, () => playPause(true));
  TrackPlayer.addEventListener(Event.RemotePause, () => playPause(false));
  TrackPlayer.addEventListener(Event.RemoteStop, () => resetPlayer());
  TrackPlayer.addEventListener(Event.RemoteNext, () => nextTrack());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => prevTrack());
  TrackPlayer.addEventListener(Event.RemoteSeek, (data) => seek(data.position));
  TrackPlayer.addEventListener(Event.RemoteJumpForward, () => seekForward(10));
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, () =>
    seekBackward(10)
  );
};
