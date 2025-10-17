let audioCtx;
let currentSource;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

export const playTrack = async (file) => {
  if (!audioCtx) return;
  if (currentSource) currentSource.stop();

  const res = await fetch(file);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(arrayBuffer);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.loop = true;
  source.start(0);
  currentSource = source;
};

export const stopTrack = () => {
  if (currentSource) currentSource.stop();
};