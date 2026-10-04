export function clean(value){
 if(Array.isArray(value)) return value.map(clean);
 if(value && typeof value==='object'){
   const out={};
   for(const [k,v] of Object.entries(value)){
     if(k==="_id") out.id=String(v);
     else if(k==="__v") continue;
     else if(k.endsWith("_id") && v && typeof v==='object' && v._id) out[k]=String(v._id);
     else out[k]=clean(v);
   }
   return out;
 }
 return value;
}
export const doc=(d)=>clean(d?.toObject?d.toObject():d);
export const docs=(d)=>clean(d);
