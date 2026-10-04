import {createContext,useContext,useEffect,useState} from "react";
import {api} from "../services/api";

const C=createContext(null);

export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("smartmove_user"))||null}catch{return null}});
 const [loading,setLoading]=useState(false);
 const saveSession=(data)=>{localStorage.setItem("smartmove_token",data.token);localStorage.setItem("smartmove_user",JSON.stringify(data.user));setUser(data.user)};
 const login=async(data)=>{setLoading(true);try{const r=await api.post("/auth/login",data);saveSession(r.data);return r.data}finally{setLoading(false)}};
 const register=async(data)=>{setLoading(true);try{const r=await api.post("/auth/register",data);saveSession(r.data);return r.data}finally{setLoading(false)}};
 const googleLogin=async(credential)=>{setLoading(true);try{const r=await api.post("/auth/google",{credential});saveSession(r.data);return r.data}finally{setLoading(false)}};
 const logout=()=>{localStorage.removeItem("smartmove_token");localStorage.removeItem("smartmove_user");setUser(null)};
 const refresh=async()=>{if(!localStorage.getItem("smartmove_token"))return;try{const r=await api.get("/auth/me");setUser(r.data);localStorage.setItem("smartmove_user",JSON.stringify(r.data))}catch{logout()}};
 useEffect(()=>{refresh()},[]);
 return <C.Provider value={{user,loading,login,register,googleLogin,logout,refresh}}>{children}</C.Provider>
}
export const useAuth=()=>useContext(C);
