import { Howl } from 'howler';

let currentTrack;
let previousTrack; // Track anterior para transiciones suaves
let currentTrackUrl = "";

export const initAudio = async () => {
  // Howler maneja el AudioContext automáticamente
  return true;
};

export const stopAllTracks = () => {
  console.log('[audio] Stopping all tracks, current:', currentTrackUrl);
  if (currentTrack) {
    try {
      currentTrack.stop();
      currentTrack.unload();
    } catch (e) {
      console.error('[audio] Error stopping current track:', e);
    }
    currentTrack = null;
  }
  if (previousTrack) {
    try {
      previousTrack.stop();
      previousTrack.unload();
    } catch (e) {
      console.error('[audio] Error stopping previous track:', e);
    }
    previousTrack = null;
  }
  currentTrackUrl = "";
  console.log('[audio] All tracks stopped and unloaded completely');
};

export const forceStopCurrentTrack = () => {
  console.log('[audio] Force stopping current track IMMEDIATELY:', currentTrackUrl);
  if (currentTrack) {
    try {
      currentTrack.stop();
      currentTrack.unload();
    } catch (e) {
      console.error('[audio] Error force stopping track:', e);
    }
    currentTrack = null;
    currentTrackUrl = "";
  }
};

export const muteCurrentTrack = () => {
  if (currentTrack) {
    currentTrack.volume(0);
    console.log('[audio] Current track muted');
  }
};

const playTrackInternal = (file) => {
  // Si la canción ya está sonando, no la cortamos
  if (currentTrackUrl === file && currentTrack && currentTrack.playing()) {
    console.log('[audio] Track already playing: ', file);
    return;
  }

  // Detener completamente el track anterior (sin fade)
  if (currentTrack) {
    try {
      currentTrack.stop();
      currentTrack.unload();
    } catch (e) {}
  }
  if (previousTrack) {
    try {
      previousTrack.stop();
      previousTrack.unload();
    } catch (e) {}
    previousTrack = null;
  }

  currentTrackUrl = file;
  currentTrack = new Howl({
    src: [file],
    loop: true,
    volume: 0.3,
    onload: () => {
      console.log("Pista cargada:", file);
    },
    onloaderror: (id, error) => {
      console.error("Error cargando la pista:", error);
    },
    onplay: () => {
      console.log("Reproduciendo pista:", file);
    },
    onplayerror: (id, error) => {
      console.error("Error reproduciendo la pista:", error);
    }
  });

  currentTrack.play();
};

export const playTrack = async (file) => {
  await initAudio();
  return playTrackInternal(file);
};

const playSFXInternal = (file) => {
  const sfx = new Howl({
    src: [file],
    volume: 0.9,
    onloaderror: (id, error) => {
      console.error("Error en SFX:", error);
    },
    onplayerror: (id, error) => {
      console.error("Error reproduciendo SFX:", error);
    }
  });

  sfx.play();
};

export const playSFX = async (file) => {
  await initAudio();
  return playSFXInternal(file);
};

export const unlockAudioByUserGesture = async () => {
  // Howler no requiere unlock manual, pero podemos forzar un sonido silencioso si es necesario
  return true;
};