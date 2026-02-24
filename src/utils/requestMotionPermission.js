export async function requestMotionPermission() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      return response === "granted";
    } catch (e) {
      console.error("Error requesting motion permission", e);
      return false;
    }
  }
  return true; // Android no necesita permiso
}