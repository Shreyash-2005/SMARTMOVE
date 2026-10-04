import {api} from "./api.js";
export const startTrip=(data)=>api.post("/trips/start",data).then(r=>r.data);
export const getActiveTrip=()=>api.get("/trips/active").then(r=>r.data);
export const updateTripLocation=(id,data)=>api.patch(`/trips/${id}/location`,data).then(r=>r.data);
export const stopTrip=(id,status="STOPPED")=>api.post(`/trips/${id}/stop`,{status}).then(r=>r.data);
export const getSharedTrip=(token)=>api.get(`/trips/share/${token}`).then(r=>r.data);
