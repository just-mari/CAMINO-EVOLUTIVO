import { useEffect, useState } from "react";
import { Howl } from "howler";
import { gsap } from "gsap";

const EVOLUTION_STAGES = [
  { name: "Célula", color: "from-sky-400 to-blue-500", audio: "/level1.mp3" },
  { name: "Planta", color: "from-green-400 to-lime-500", audio: "/level2.mp3" },
  { name: "Animal", color: "from-orange-400 to-rose-500", audio: "/level3.mp3" },
  { name: "Humano", color: "from-purple-400 to-pink-500", audio: "/level4.mp3" },
  { name: "Conciencia", color: "from-yellow-300 to-white", audio: "/level5.mp3" },
];

export default function Journey() {
  const [steps, setSteps] = useState(0);
  const [level, setLevel] = useState(0);
  const [sound, setSound] = useState(null);
  const [motionGranted, setMotionGranted] = useState(false);

  useEffect(() => {
    // desbloquear audio con un sonido silencioso
    const unlockSound = new Howl({ src: ["/unlock.mp3"], volume: 0 });
    unlockSound.play();

    const initSound = new Howl({
      src: [EVOLUTION_STAGES[0].audio],
      loop: true,
      volume: 0.6,
    });
    setSound(initSound);
  }, []);

  const requestPermissions = async () => {
    try {
      if (typeof DeviceMotionEvent?.requestPermission === "function") {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === "granted") setMotionGranted(true);
      } else {
        setMotionGranted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!motionGranted || !sound) return;

    let lastMove = 0;
    let moving = false;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();

      if (total > 10) {
        if (!moving) {
          moving = true;
          sound.play();
        }
        if (now - lastMove > 300) {
          setSteps((prev) => prev + 1);
          lastMove = now;
        }
      } else {
        moving = false;
        sound.pause();
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      sound.stop();
    };
  }, [motionGranted, sound]);

  // actualizar nivel según pasos
  useEffect(() => {
    const newLevel = Math.min(Math.floor(steps / 20), EVOLUTION_STAGES.length - 1);
    if (newLevel !== level) {
      setLevel(newLevel);
      if (sound) {
        sound.stop();
        const next = new Howl({
          src: [EVOLUTION_STAGES[newLevel].audio],
          loop: true,
          volume: 0.7,
        });
        setSound(next);
        next.play();
      }
    }
    gsap.to("#evolution", {
      scale: 1 + steps / 30,
      duration: 1,
      ease: "power2.out",
    });
  }, [steps]);

  const stage = EVOLUTION_STAGES[level];

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-b from-black to-gray-900 text-white">
      {!motionGranted ? (
        <button
          onClick={requestPermissions}
          className="px-6 py-3 bg-white text-black rounded-full"
        >
          Activar sensores
        </button>
      ) : (
        <>
          <div
            id="evolution"
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${stage.color} shadow-lg`}
          ></div>
          <h2 className="text-2xl font-bold mt-4">{stage.name}</h2>
          <p className="opacity-70 text-sm mt-2">Pasos: {steps}</p>
        </>
      )}
    </div>
  );
}