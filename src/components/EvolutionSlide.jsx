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
  
  // SOLUCIÓN A: Estado para manejar los permisos de iOS
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const audioRef = useRef(null);
  const totalSteps = 30; // pasos necesarios por etapa
  const theme = themes[level] || themes[1];

  // Función para solicitar permisos de movimiento (iOS 13+) y habilitar audio
  const requestMotionPermission = async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          setPermissionGranted(true);
        } else {
          alert("Necesitamos acceso a los sensores para que puedas evolucionar.");
        }
      } catch (error) {
        console.error("Error pidiendo permisos:", error);
      }
    } else {
      // Dispositivos Android o PC que no requieren permisos
      setPermissionGranted(true);
    }
  };

  // Reproducir sonido ambiental por etapa (SOLUCIÓN B: Cleanup)
  useEffect(() => {
    // Solo reproducimos si ya nos dieron permiso (interacción del usuario)
    if (!permissionGranted) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(`/sounds/${data.sound}`);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(() => console.warn("Audio bloqueado hasta interacción"));

    // Cleanup: pausar y reiniciar cuando se desmonte el componente o cambie el sonido
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [data.sound, permissionGranted]);

  // Detectar movimiento (SOLUCIÓN A: Solo escuchar si hay permisos)
  useEffect(() => {
    if (!permissionGranted) return;

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
  }, [permissionGranted]);

  // Evolucionar cuando alcanza el total (SOLUCIÓN C: Cleanup de Timeout)
  useEffect(() => {
    let timeoutId;

    if (steps >= totalSteps && !evolving) {
      setEvolving(true);
      setTransitioning(true);

      const unlock = new Audio("/sounds/unlock.mp3");
      unlock.play().catch(() => {});
      
      timeoutId = setTimeout(() => {
        onNext();
        setSteps(0);
        setEvolving(false);
        setTransitioning(false);
      }, 3000);
    }

    // Cleanup del timeout si el componente se desmonta antes de los 3 segundos
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [steps, evolving, onNext, totalSteps]);

  const progress = Math.min((steps / totalSteps) * 100, 100);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br ${theme.bg} transition-all duration-700 relative overflow-hidden`}
    >
      {/* SOLUCIÓN A: Pantalla inicial para pedir permisos si no los hay */}
      {!permissionGranted ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col items-center px-6 text-center z-10"
        >
          <div className={`w-24 h-24 mb-6 ${theme.accent} rounded-full shadow-2xl animate-pulse`} />
          <h1 className="text-3xl font-bold mb-4 drop-shadow-md">¿Listo para evolucionar?</h1>
          <p className="text-lg mb-8 max-w-sm drop-shadow-md opacity-90">
            Agita tu dispositivo o camina para avanzar de etapa.
          </p>
          <button
            onClick={requestMotionPermission}
            className="px-8 py-3 bg-white text-black font-bold text-lg rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            Comenzar
          </button>
        </motion.div>
      ) : (
        /* Código original: Contenido de la evolución */
        <AnimatePresence>
          {!transitioning && (
            <motion.div
              key={data.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center px-6 text-center z-10"
            >
              <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{data.title}</h1>
              <p className="text-md mb-8 max-w-md opacity-90 drop-shadow-md">{data.text}</p>

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
              <div className="w-64 bg-black/20 rounded-full h-3 mt-8 overflow-hidden shadow-md">
                <motion.div
                  className="bg-white h-3 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="mt-4 text-sm font-semibold opacity-90 drop-shadow-md">
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
              className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 2 }}
                className={`w-64 h-64 rounded-full bg-gradient-to-r ${theme.bg}`}
              />
              <p className="mt-6 text-2xl font-bold animate-pulse">🌱 Evolucionando...</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}