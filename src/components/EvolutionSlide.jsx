import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playTrack, playSFX, stopAllTracks, forceStopCurrentTrack } from "../utils/soundManager";

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
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [hasStartedWalking, setHasStartedWalking] = useState(false);

  const totalSteps = 30; // pasos necesarios por etapa
  const theme = themes[level] || themes[1];

  // Reproducir sonido de fondo: música base o level1 según estado
  useEffect(() => {
    if (transitioning) {
      console.log('[music] Transitioning - FORCE STOPPING all tracks and playing ONLY level2.mp3');
      forceStopCurrentTrack(); // Forzar stop inmediato
      playTrack("/level2.mp3");
    } else if (hasStartedWalking && steps > 0) {
      console.log('[music] Walking - playing level1.mp3');
      playTrack("/level1.mp3");
    } else if (data && data.sound) {
      console.log('[music] Base music - playing', data.sound);
      playTrack(data.sound);
    }
  }, [transitioning, hasStartedWalking, steps, data.sound]);

  // Detectar cuando comienza a haber pasos
  useEffect(() => {
    if (steps === 1 && !hasStartedWalking) {
      setHasStartedWalking(true);
      console.log('[music] Starting walking - playing level1.mp3');
    }
  }, [steps, hasStartedWalking]);

  // Detectar movimiento agresivo (batucazos del celular) - iOS y Android
  useEffect(() => {
    let motionHandler;
    let motionTimeout;
    let lastStepTime = 0;
    const MIN_STEP_INTERVAL = 400;
    const SHAKE_THRESHOLD = 10; // Ajustado para Android (Infinix)

    const requestPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            console.log('[motion] Permission granted');
            return true;
          } else {
            console.log('[motion] Permission denied');
            return false;
          }
        } catch (error) {
          console.error('[motion] Error requesting permission:', error);
          return false;
        }
      }
      return true; // No need for permission
    };

    const startMotionListener = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        console.log('[motion] No permission for devicemotion');
        setMotionAvailable(false);
        return;
      }

      motionHandler = (e) => {
        const acc = e.accelerationIncludingGravity || e.acceleration;
        if (!acc) return;
        const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        console.log('[motion] magnitude:', magnitude, 'acc:', acc.x, acc.y, acc.z);
        
        if (magnitude > SHAKE_THRESHOLD && Date.now() - lastStepTime > MIN_STEP_INTERVAL) {
          console.log('[motion] shake detected! magnitude:', magnitude);
          lastStepTime = Date.now();
          setSteps((prev) => (prev < totalSteps ? prev + 1 : prev));
        }
      };
      window.addEventListener("devicemotion", motionHandler);
      setMotionAvailable(true);
      console.log('[motion] listener started');
    };

    // Habilitar listener de motion directamente
    if ("ondevicemotion" in window || typeof DeviceMotionEvent !== "undefined") {
      startMotionListener();
      
      // Timeout para indicar si el batuqueo está funcionando
      motionTimeout = setTimeout(() => {
        console.log('[motion] Timeout: batuqueo puede no estar disponible o no se detectó movimiento');
      }, 3000);
    } else {
      console.log('[motion] devicemotion API not available');
    }

    return () => {
      if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
      if (motionTimeout) clearTimeout(motionTimeout);
    };
  }, []);

  // Evolucionar cuando alcanza el total
  useEffect(() => {
    if (steps >= totalSteps && !evolving) {
      setEvolving(true);
      setTransitioning(true);

      // Reproducimos efecto de sonido al completar la etapa
      playSFX("/unlock.mp3");

      setTimeout(() => {
        onNext();
        setSteps(0);
        setHasStartedWalking(false);
        setEvolving(false);
        setTransitioning(false);
      }, 20000); // Aumentado a 5 segundos para escuchar el audio de evolución
    }
  }, [steps, evolving, onNext]);

  const progress = Math.min((steps / totalSteps) * 100, 100);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br ${theme.bg} transition-all duration-700 relative overflow-hidden`}>
      {/* Debug / fallback UI for desktop */}
      <div className="absolute top-4 right-4 z-30 text-sm text-white/80">
        <div>Motion: {motionAvailable ? 'available' : 'fallback'}</div>
        <button
          onClick={() => { console.log('[button] simular paso click'); setSteps((prev) => (prev < totalSteps ? prev + 1 : prev)); }}
          className="mt-2 px-3 py-1 bg-white/20 rounded hover:bg-white/40 transition-colors"
        >
          Simular paso
        </button>
      </div>
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