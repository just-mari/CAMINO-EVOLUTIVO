import { useEffect, useRef } from "react";
import { playTrack, stopTrack } from "../utils/soundManager";

export default function EvolutionSlide({ data, onNext }) {
  const motionRef = useRef({ last: 0, count: 0 });

  useEffect(() => {
    if (data.music) playTrack(data.music);
    return () => stopTrack();
  }, [data]);

  useEffect(() => {
    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

      // Cada pico de movimiento suma
      if (total > 25 && Date.now() - motionRef.current.last > 800) {
        motionRef.current.last = Date.now();
        motionRef.current.count += 1;
        if (motionRef.current.count >= 6) { // 6 pasos ≈ siguiente etapa
          onNext();
          motionRef.current.count = 0;
        }
      }
    };

    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // iOS
      DeviceMotionEvent.requestPermission()
        .then((res) => res === "granted" && window.addEventListener("devicemotion", handleMotion))
        .catch(console.error);
    } else {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [onNext]);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-center text-white transition-all duration-700 ease-in-out"
      style={{ background: `linear-gradient(180deg, ${data.color1}, ${data.color2})` }}
    >
      <img src={data.image} alt={data.title} className="w-40 h-40 mb-8 animate-pulse" />
      <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
      <p className="max-w-md text-lg mb-10 px-6">{data.text}</p>
      <p className="text-sm opacity-70">Camina para evolucionar…</p>
    </div>
  );
}


