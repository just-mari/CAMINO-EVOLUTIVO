import { useEffect, useState } from "react";
import { Howl } from "howler";
import { gsap } from "gsap";

export default function Journey() {
  const [steps, setSteps] = useState(0);
  const [sound, setSound] = useState(null);
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    // cargar audio base
    const bgSound = new Howl({
      src: ["/audio/base.mp3"],
      loop: true,
      volume: 0.5,
    });
    setSound(bgSound);

    // solicitar permisos de movimiento (para iOS)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!sound) return;

    let lastMove = 0;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      const now = Date.now();

      if (acc && Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z) > 20) {
        if (now - lastMove > 500) {
          setSteps((prev) => prev + 1);
          lastMove = now;
          if (!motionActive) {
            setMotionActive(true);
            sound.play();
          }
        }
      } else {
        if (motionActive) {
          setMotionActive(false);
          sound.pause();
        }
      }
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      sound.stop();
    };
  }, [sound, motionActive]);

  // animación visual básica con GSAP
  useEffect(() => {
    gsap.to("#evolution", {
      scale: 1 + steps / 50,
      duration: 1,
      ease: "power2.out",
    });
  }, [steps]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center h-screen bg-gradient-to-b from-black to-gray-800">
      <div
        id="evolution"
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-lime-500 shadow-lg"
      ></div>
      <p className="text-lg">Pasos detectados: {steps}</p>
      <p className="text-sm opacity-70">
        Camina suavemente con tu teléfono para evolucionar.
      </p>
    </div>
  );
}
