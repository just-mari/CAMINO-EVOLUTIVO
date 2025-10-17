import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Asegúrate de instalarlo: npm install framer-motion

export default function EvolutionSlide({ data, onNext }) {
  const [steps, setSteps] = useState(0);
  const [evolving, setEvolving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);

  // reproducir sonido de evolución
  const playSound = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(`/sounds/${sound}`);
    audioRef.current.volume = 0.7;
    audioRef.current.play().catch((err) => console.warn("Error audio:", err));
  };

  // detectar movimiento
  useEffect(() => {
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      if (magnitude > 13) {
        setSteps((prev) => prev + 1);
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  // cuando alcanza 30 pasos, evoluciona
  useEffect(() => {
    if (steps >= 30 && !evolving) {
      setEvolving(true);
      setTransitioning(true);
      playSound("unlock.mp3"); // sonido de transición
      setTimeout(() => {
        onNext();
        setSteps(0);
        setEvolving(false);
        setTransitioning(false);
      }, 3000); // duración del efecto de transición
    }
  }, [steps, evolving, onNext]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative overflow-hidden">
      <AnimatePresence>
        {!transitioning && (
          <motion.div
            key={data.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-center max-w-md mb-8 opacity-90">{data.text}</p>
            <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse shadow-2xl" />
            <p className="mt-6 text-sm opacity-80">Pasos: {steps}/30</p>
          </motion.div>
        )}

        {transitioning && (
          <motion.div
            key="evolution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center absolute inset-0 bg-black"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 2 }}
              className="w-64 h-64 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500"
            />
            <p className="mt-6 text-lg">🌱 Evolucionando...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
