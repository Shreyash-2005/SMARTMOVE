import mongoose from 'mongoose';
const schema=new mongoose.Schema({user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},source:String,destination:String,mode:String,distance_km:Number,eta_minutes:Number,points:Array},{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});
export default mongoose.models.Route || mongoose.model('Route',schema);
