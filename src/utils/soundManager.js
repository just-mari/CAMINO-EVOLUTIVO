let audioCtx;
let currentSource;
let gainNode;
let currentTrackUrl = "";
let unlocked = false;
let pendingQueue = [];
let listenerAdded = false;

export const initAudio = async () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Control de volumen para la música de fondo (50%)
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5; 
    gainNode.connect(audioCtx.destination);

    // HACK PARA iOS: Reproducir un sonido vacío para desbloquear el audio
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const unlockSource = audioCtx.createBufferSource();
    unlockSource.buffer = buffer;
    unlockSource.connect(audioCtx.destination);
    try {
      unlockSource.start(0);
    } catch (e) {
      // algunos navegadores pueden lanzar si no está desbloqueado aún
    }
  }

  if (audioCtx.state === 'suspended') {
    try {
      await audioCtx.resume();
    } catch (e) {
      console.warn('No se pudo resumir AudioContext:', e);
    }
  }

  unlocked = audioCtx.state === 'running';
  return unlocked;
};

const playTrackInternal = async (file) => {
  // Si la canción ya está sonando, no la cortamos
  if (currentTrackUrl === file && currentSource) return;

  // Detener la canción anterior
  if (currentSource) {
    try { currentSource.stop(); } catch (e) {}
    try { currentSource.disconnect(); } catch (e) {}
  }

  try {
    currentTrackUrl = file;
    const res = await fetch(file);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);

    currentSource = audioCtx.createBufferSource();
    currentSource.buffer = buffer;
    currentSource.connect(gainNode);
    currentSource.loop = true;
    currentSource.start(0);
  } catch (error) {
    console.error("Error cargando la pista:", error);
    currentTrackUrl = "";
  }
};

export const playTrack = async (file) => {
  const isUnlocked = await initAudio();
  if (!isUnlocked) {
    if (!listenerAdded) {
      listenerAdded = true;
      const unlock = async () => {
        await unlockAudioByUserGesture();
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('touchstart', unlock, { once: true });
      document.addEventListener('click', unlock, { once: true });
    }
    pendingQueue.push({ type: "track", file });
    return;
  }
  return playTrackInternal(file);
};

const playSFXInternal = async (file) => {
  try {
    const res = await fetch(file);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);

    const sfxSource = audioCtx.createBufferSource();
    sfxSource.buffer = buffer;

    // Volumen independiente para los efectos de sonido (90%)
    const sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.9;
    sfxSource.connect(sfxGain);
    sfxGain.connect(audioCtx.destination);

    sfxSource.start(0);
  } catch (error) {
    console.error("Error en SFX:", error);
  }
};

export const playSFX = async (file) => {
  const isUnlocked = await initAudio();
  if (!isUnlocked) {
    if (!listenerAdded) {
      listenerAdded = true;
      const unlock = async () => {
        await unlockAudioByUserGesture();
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('touchstart', unlock, { once: true });
      document.addEventListener('click', unlock, { once: true });
    }
    pendingQueue.push({ type: "sfx", file });
    return;
  }
  return playSFXInternal(file);
};

export const unlockAudioByUserGesture = async () => {
  const isUnlocked = await initAudio();
  if (isUnlocked && pendingQueue.length) {
    const queue = pendingQueue.splice(0);
    for (const item of queue) {
      if (item.type === "track") playTrackInternal(item.file);
      if (item.type === "sfx") playSFXInternal(item.file);
    }
  }
  return isUnlocked;
};