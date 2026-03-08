import { Howl } from 'howler';

let currentTrack;
let currentTrackUrl = "";

export const initAudio = async () => {
  // Howler maneja el AudioContext automáticamente
  return true;
};

export const stopAllTracks = () => {
  console.log('[audio] Stopping all tracks, current:', currentTrackUrl);
  if (currentTrack) {
    try {
      currentTrack.unload(); // Unload completamente para asegurar que se detiene
    } catch (e) {}
    currentTrack = null;
  }
  currentTrackUrl = "";
  console.log('[audio] All tracks stopped and unloaded');
};

const playTrackInternal = (file) => {
  // Si la canción ya está sonando, no la cortamos
  if (currentTrackUrl === file && currentTrack && !currentTrack.playing()) {
    currentTrack.play();
    return;
  }

  // Detener la canción anterior
  if (currentTrack) {
    currentTrack.stop();
  }

  currentTrackUrl = file;
  currentTrack = new Howl({
    src: [file],
    loop: true,
    volume: 0.5,
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