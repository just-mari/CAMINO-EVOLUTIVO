import { useEffect, useRef, useState } from "react";
import useMotion from "./UseMotion";
import { createSound } from "../utils/soundManager";

export default function EvolutionSlide({ data }) {

  const moving = useMotion();

  const ambientRef = useRef(null);
  const narrationRef = useRef(null);

  const [textIndex, setTextIndex] = useState(0);

  if (!data) return <div className="text-white">Cargando...</div>;

  useEffect(() => {

    if (!data.ambient || !data.narration) return;

    ambientRef.current = createSound(data.ambient, true, 0.4);
    narrationRef.current = createSound(data.narration, false, 1);

    ambientRef.current?.play().catch(() => {});

    setTextIndex(0);

    return () => {
      ambientRef.current?.pause();
      narrationRef.current?.pause();
    };

  }, [data]);

  useEffect(() => {

    if (!narrationRef.current) return;

    if (moving) narrationRef.current.play().catch(() => {});
    else narrationRef.current.pause();

  }, [moving]);

  useEffect(() => {

    if (!moving) return;

    const interval = setInterval(() => {
      setTextIndex(i => Math.min(i + 1, data.text.length - 1));
    }, 3000);

    return () => clearInterval(interval);

  }, [moving, data.text]);

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6">

      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>

      <p className="text-lg max-w-md">
        {data.text[textIndex]}
      </p>

      <div className="mt-6 text-sm opacity-70">
        {moving ? "🚶 Caminando..." : "⏸ Detenido"}
      </div>

    </div>
  );
}