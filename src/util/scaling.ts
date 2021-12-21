import { writable } from "svelte/store";
import CONFIG from "../data/config";

function setViewportContent(value: string) {
  const viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute("content", value);
  }
}

export function setNotZoomable() {
  setViewportContent("width=device-width,initial-scale=1.0,maximum-scale=1.0");
}

export function setZoomable() {
  setViewportContent("width=device-width,initial-scale=1.0");
}

export const pinchToZoomEnabled = writable<boolean>(true);
let lastPinchToZoomValue = true;
pinchToZoomEnabled.subscribe((newValue) => {
  if (newValue) {
    setZoomable();
  } else {
    setNotZoomable();
  }
  if (lastPinchToZoomValue !== newValue) {
    CONFIG.setEnablePinchToZoom(newValue);
    lastPinchToZoomValue = newValue;
  }
});
(async function () {
  const enabled = await CONFIG.getEnablePinchToZoom();
  pinchToZoomEnabled.set(enabled);
})();

export const textScalingFactor = writable<number>(0);
(async function () {
  const factor = await CONFIG.getTextScalingFactor();
  textScalingFactor.set(factor);
  textScalingFactor.subscribe((value) => {
    const scaleFactor = 100 * Math.pow(1.05, value);
    document.documentElement.style.fontSize = `${scaleFactor}%`;
    CONFIG.setTextScalingFactor(value);
  });
})();
