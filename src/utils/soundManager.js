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
      currentTrack.unload();
    } catch (e) {}
    currentTrack = null;
  }
  if (previousTrack) {
    try {
      previousTrack.unload();
    } catch (e) {}
    previousTrack = null;
  }
  currentTrackUrl = "";
  console.log('[audio] All tracks stopped and unloaded');
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

  // Guardar el track anterior para transición suave
  if (currentTrack) {
    // Reducir volumen del track anterior a 0 gradualmente
    currentTrack.fade(currentTrack.volume(), 0, 300);
    previousTrack = currentTrack;
    console.log('[audio] Fading out previous track');
  }

  currentTrackUrl = file;
  currentTrack = new Howl({
    src: [file],
    loop: true,
    volume: 0,
    onload: () => {
      console.log("Pista cargada:", file);
    },
    onloaderror: (id, error) => {
      console.error("Error cargando la pista:", error);
    },
    onplay: () => {
      console.log("Reproduciendo pista:", file);
      // Fade in suave
      currentTrack.fade(0, 0.5, 300);
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