// VERK · punto de entrada del hero (se carga con import() dinámico: no cuenta en el JS inicial).
import { startField } from './runtime.js';
import fluid from './fluid.js';

const api = await startField(fluid);
if (/[?&]tune\b/.test(location.search) && api?.set) (await import('./tune.js')).tune(api);
export default api;
