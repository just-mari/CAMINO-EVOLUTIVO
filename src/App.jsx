import { useState } from "react";
import Intro from "./components/Intro";
import EvolutionSlide from "./components/EvolutionSlide";
import { slides } from "./Data/Slides";

function App() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!started) return <Intro onStart={() => setStarted(true)} />;

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
