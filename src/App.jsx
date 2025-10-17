import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import Journey from "./components/Journey";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      {!started ? (
        <HomeScreen onStart={() => setStarted(true)} />
      ) : (
        <Journey />
      )}
    </div>
  );
}
