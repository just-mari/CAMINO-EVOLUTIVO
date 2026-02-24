import { requestMotionPermission } from "../utils/requestMotionPermission";

export default function Intro({ onStart }) {

  async function handleStart() {
    const granted = await requestMotionPermission();

    if (!granted) {
      alert("Necesitamos permiso de movimiento para continuar");
      return;
    }

    // Reproducir sonido de desbloqueo (opcional pero recomendado)
    const audio = new Audio("/audio/unlock.mp3");
    audio.play().catch(() => {});

    // Iniciar app
    onStart();
  }

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white text-center px-6">

      <h1 className="text-4xl font-bold mb-6">
        Camino Evolutivo
      </h1>

      <p className="text-lg opacity-80 mb-10 max-w-md">
        Camina para avanzar en la historia de la evolución humana
      </p>

      <button
        onClick={handleStart}
        className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold active:scale-95 transition"
      >
        Comenzar
      </button>

    </div>
  );
}