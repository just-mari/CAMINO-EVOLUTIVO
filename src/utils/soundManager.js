export function createSound(src, loop = false, volume = 1) {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  return audio;
}
