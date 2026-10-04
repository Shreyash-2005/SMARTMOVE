import {api} from "./api";
export const getLiveTraffic=async()=> (await api.get("/traffic")).data;
export const getParking=async()=> (await api.get("/parking")).data;
export const getTransport=async()=> (await api.get("/transport")).data;
export const getIssues=async()=> (await api.get("/issues/mine")).data;
