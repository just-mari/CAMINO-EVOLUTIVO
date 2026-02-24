import { useEffect, useState } from "react";

export default function useMotion() {

  const [moving, setMoving] = useState(false);

  useEffect(() => {

    let lastMoveTime = Date.now();

    function handleMotion(event) {

      const acc = event.accelerationIncludingGravity;

      if (!acc) return;

      const magnitude =
        Math.abs(acc.x || 0) +
        Math.abs(acc.y || 0) +
        Math.abs(acc.z || 0);

      if (magnitude > 8) {
        lastMoveTime = Date.now();
        setMoving(true);
      }

      if (Date.now() - lastMoveTime > 1500) {
        setMoving(false);
      }

    }

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };

  }, []);

  return moving;
}