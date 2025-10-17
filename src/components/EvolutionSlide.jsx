import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Colores temáticos según la etapa
const themes = {
  1: { bg: "from-sky-500 to-cyan-600", accent: "bg-cyan-300" },
  2: { bg: "from-green-600 to-emerald-700", accent: "bg-lime-300" },
  3: { bg: "from-amber-600 to-orange-700", accent: "bg-orange-300" },
  4: { bg: "from-purple-600 to-indigo-700", accent: "bg-fuchsia-300" },
  5: { bg: "from-gray-700 to-white", accent: "bg-white" },
};

export default function EvolutionSlide({ data, onNext, level = 1 }) {
  const [steps, setSteps] = useState(0);
  const [evolving, setEvolving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);

  const totalSteps = 30; // pasos necesarios por etapa
  const theme = themes[level] || themes[1];

  // Reproducir sonido ambiental por etapa
  useEffect(() => {
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(`/sounds/${data.sound}`);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => console.warn("Audio bloqueado hasta interacción"));
  }, [data.sound]);

  // Detectar movimiento
  useEffect(() => {
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      if (magnitude > 13) {
        setSteps((prev) => (prev < totalSteps ? prev + 1 : prev));
      }
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  // Evolucionar cuando alcanza el total
  useEffect(() => {
    if (steps >= totalSteps && !evolving) {
      setEvolving(true);
      setTransitioning(true);

      const unlock = new Audio("/sounds/unlock.mp3");
      unlock.play().catch(() => {});
      setTimeout(() => {
        onNext();
        setSteps(0);
        setEvolving(false);
        setTransitioning(false);
      }, 3000);
    }
  }, [steps, evolving, onNext]);

  const progress = Math.min((steps / totalSteps) * 100, 100);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br ${theme.bg} transition-all duration-700 relative overflow-hidden`}
    >
      <AnimatePresence>
        {!transitioning && (
          <motion.div
            key={data.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center px-6 text-center"
          >
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-md mb-8 max-w-md opacity-90">{data.text}</p>

            {/* Elemento simbólico evolutivo */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className={`w-48 h-48 ${theme.accent} rounded-full shadow-2xl`}
            />

            {/* Barra de progreso */}
            <div className="w-64 bg-white/20 rounded-full h-3 mt-8 overflow-hidden shadow-md">
              <motion.div
                className="bg-white h-3"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <p className="mt-4 text-sm opacity-80">
              {steps} / {totalSteps} pasos
            </p>
          </motion.div>
        )}

        {transitioning && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 2 }}
              className={`w-64 h-64 rounded-full bg-gradient-to-r ${theme.bg}`}
            />
            <p className="mt-6 text-lg animate-pulse">🌱 Evolucionando...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}