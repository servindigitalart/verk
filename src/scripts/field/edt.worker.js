// VERK · Worker de geometría: calcula fuera del hilo principal los campos de distancia del isotipo y del texto.
import { signedDistance } from './edt.js';
self.onmessage = ({ data: { id, masks, w, h } }) => {
  const out = masks.map((m) => signedDistance(m, w, h));
  self.postMessage({ id, out }, out.map((o) => o.buffer));
};
