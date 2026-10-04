import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {GoogleLogin} from "@react-oauth/google";
import {useAuth} from "../../context/AuthContext";
import {getError} from "../../services/api";

function GoogleAuth({onError}){
  const {googleLogin}=useAuth();
  const nav=useNavigate();
  return <div className="google-login">
    <GoogleLogin
      onSuccess={async(response)=>{
        try{
          if(!response.credential) throw new Error("Google did not return a credential");
          await googleLogin(response.credential);
          nav("/dashboard");
        }catch(e){onError(getError(e))}
      }}
      onError={()=>onError("Google authentication failed. Please try again.")}
      useOneTap={false}
      text="continue_with"
      shape="rectangular"
      width="100%"
    />
  </div>;
}

function Divider(){return <div className="google-divider"><span>OR</span></div>}

export function Login(){
 const [f,setF]=useState({email:"",password:""}),[err,setErr]=useState("");
 const {login,loading}=useAuth(); const nav=useNavigate();
 const go=async e=>{e.preventDefault();setErr("");try{await login(f);nav("/dashboard")}catch(e){setErr(getError(e))}};
 return <AuthShell title="Welcome back" sub="Sign in to your SMARTMOVE account">
   <form onSubmit={go}>
     {err&&<div className="error-box">{err}</div>}
     <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label>
     <label>Password<input type="password" required autoComplete="current-password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label>
     <div className="form-row"><Link to="/forgot-password">Forgot password?</Link></div>
     <button className="btn primary full" disabled={loading}>{loading?"Signing in…":"Sign in"}</button>
   </form>
   <Divider/>
   <GoogleAuth onError={setErr}/>
   <p className="auth-bottom">New here? <Link to="/register">Create an account</Link></p>
 </AuthShell>
}

export function Register(){
 const [f,setF]=useState({full_name:"",email:"",phone:"",password:"",confirm:""}),[err,setErr]=useState("");
 const {register,loading}=useAuth(); const nav=useNavigate();
 const go=async e=>{e.preventDefault();setErr("");if(f.password!==f.confirm)return setErr("Passwords do not match");try{await register(f);nav("/dashboard")}catch(e){setErr(getError(e))}};
 return <AuthShell title="Create your account" sub="Join the connected city mobility platform">
   <form onSubmit={go}>
     {err&&<div className="error-box">{err}</div>}
     <label>Full name<input required autoComplete="name" value={f.full_name} onChange={e=>setF({...f,full_name:e.target.value})}/></label>
     <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label>
     <label>Phone<input autoComplete="tel" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></label>
     <div className="two">
       <label>Password<input type="password" required minLength="8" autoComplete="new-password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label>
       <label>Confirm password<input type="password" required minLength="8" autoComplete="new-password" value={f.confirm} onChange={e=>setF({...f,confirm:e.target.value})}/></label>
     </div>
     <button className="btn primary full" disabled={loading}>{loading?"Creating…":"Create account"}</button>
   </form>
   <Divider/>
   <GoogleAuth onError={setErr}/>
   <p className="auth-bottom">Already have an account? <Link to="/login">Sign in</Link></p>
 </AuthShell>
}

export function Forgot(){return <AuthShell title="Reset access" sub="Use a secure password and keep your account protected."><div className="info-box">Password reset by email requires an email provider. You can still change your password securely from your profile after signing in.</div><Link className="btn primary full" to="/login">Return to login</Link></AuthShell>}
function AuthShell({title,sub,children}){return <div className="auth-page"><div className="auth-brand"><span className="brand-mark">S</span><b>SMARTMOVE</b><p>Urban mobility, connected.</p></div><div className="auth-card"><span className="eyebrow">SMART CITY PLATFORM</span><h1>{title}</h1><p>{sub}</p>{children}</div></div>}
