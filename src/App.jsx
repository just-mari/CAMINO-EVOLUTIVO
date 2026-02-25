import { useState } from "react";
import StartScreen from "./components/StartScreen";
import Intro from "./components/Intro";
import EvolutionSlide from "./components/EvolutionSlide";
import { slides } from "./Data/Slides";

function App() {
  const [stage, setStage] = useState("start"); // "start" → "intro" → "evolution"
  const [current, setCurrent] = useState(0);

  if (stage === "start") return <StartScreen onStart={() => setStage("intro")} />;
  if (stage === "intro") return <Intro onStart={() => setStage("evolution")} />;

  return (
    <EvolutionSlide
      data={slides[current]}
      onNext={() =>
        setCurrent((prev) => (prev + 1 < slides.length ? prev + 1 : prev))
      }
    />
  );
}

export default App;