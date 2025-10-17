import { motion } from "framer-motion";

export default function StartScreen({ onStart }) {
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

      {/* Elemento visual inspirado en tu SVG */}
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

      {/* Botón interactivo */}
      <motion.button
        onClick={onStart}
        className="mt-12 px-10 py-4 bg-emerald-400/20 border border-emerald-400/50 rounded-full text-emerald-200 font-medium hover:bg-emerald-400/30 backdrop-blur-md transition-all duration-300 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Iniciar experiencia
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
