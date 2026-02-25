import { motion } from "framer-motion";
import { useState } from "react";
import { initAudio, playSFX, unlockAudioByUserGesture } from "../utils/soundManager";

export default function StartScreen({ onStart }) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);

    // 1. Intentar desbloquear audio con el gesto del usuario
    const unlocked = await unlockAudioByUserGesture();
    if (unlocked) {
      playSFX("/unlock.mp3");
    } else {
      // Fallback: intentar con HTMLAudio (algunos navegadores permiten esto tras click)
      try { new Audio('/unlock.mp3').play(); } catch (e) {}
    }

    // 2. Pedir permisos de sensores (Obligatorio en iOS)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          alert("Necesitamos acceso a los sensores para la experiencia.");
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 3. Esperar 1.5 segundos antes de pasar al Nivel 1
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white text-center overflow-hidden relative">
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-sky-400/20 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Título principal */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold mb-6 tracking-wide z-10"
      >
        Recorrido <span className="text-emerald-300">Evolutivo</span>
      </motion.h1>

      {/* Elemento visual */}
      <motion.div
        className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-400 to-amber-300 shadow-2xl flex items-center justify-center relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1, 0.95, 1], opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm uppercase tracking-widest text-white/80 z-10"
        >
          Un viaje de transformación
        </motion.p>
      </motion.div>

      {/* Botón interactivo modificado */}
      <motion.button
        onClick={handleStart}
        disabled={isStarting}
        className={`mt-12 px-10 py-4 border rounded-full font-medium backdrop-blur-md transition-all duration-300 z-10 
          ${isStarting 
            ? "bg-emerald-600/50 border-emerald-500 text-white cursor-wait" 
            : "bg-emerald-400/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-400/30"
          }`}
        whileHover={!isStarting ? { scale: 1.05 } : {}}
        whileTap={!isStarting ? { scale: 0.95 } : {}}
      >
        {isStarting ? "Desbloqueando..." : "Iniciar experiencia"}
      </motion.button>

      {/* Pequeño brillo de fondo */}
      <motion.div
        className="absolute -bottom-32 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
    </div>
  );
}