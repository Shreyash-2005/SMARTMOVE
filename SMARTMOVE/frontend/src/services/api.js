import axios from "axios";
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"/api",timeout:15000});
api.interceptors.request.use(config=>{const t=localStorage.getItem("smartmove_token");if(t)config.headers.Authorization=`Bearer ${t}`;return config});
export function getError(e){return e?.response?.data?.message||e?.message||"Something went wrong"}
