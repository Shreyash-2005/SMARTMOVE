import {api} from './api.js';
export async function computeGoogleRoute(origin,destination,mode,preferences={}){const r=await api.post('/routes/compute',{origin,destination,mode,preferences});return r.data;}
