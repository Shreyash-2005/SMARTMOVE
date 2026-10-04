import {createContext,useContext,useEffect,useState} from "react";
const C=createContext();
export function ThemeProvider({children}){
 const [dark,setDark]=useState(localStorage.getItem("smartmove_theme")==="dark");
 useEffect(()=>{document.documentElement.classList.toggle("dark",dark);localStorage.setItem("smartmove_theme",dark?"dark":"light")},[dark]);
 return <C.Provider value={{dark,setDark}}>{children}</C.Provider>
}
export const useTheme=()=>useContext(C);
