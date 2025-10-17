export default function HomeScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold tracking-wide">CAMINO EVOLUTIVO</h1>
      <p className="text-sm opacity-80">
        Una experiencia sensorial donde el movimiento es evolución.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 mt-6 text-black bg-white rounded-full hover:bg-gray-200 transition"
      >
        Comenzar experiencia
      </button>
    </div>
  );
}