import { initAudio } from "../utils/soundManager";

export default function Intro({ onStart }) {
  const handleStart = () => {
    initAudio(); // crea el contexto de audio dentro del clic
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-500 to-indigo-800 text-white text-center px-6">
      <h1 className="text-4xl font-bold mb-6">Camino Evolutivo</h1>
      <p className="text-lg mb-8">
        Explora el viaje de la vida a través del movimiento y el sonido.
      </p>
      <button
        onClick={handleStart}
        className="px-8 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
      >
        Comenzar
      </button>
    </div>
  );
}

