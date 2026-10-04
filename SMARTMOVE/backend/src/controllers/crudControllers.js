import {Traffic,Parking,Transport,Authority,Favorite,Alert,Announcement} from "../models/all.js"; import {doc,docs} from "../utils/serialize.js";
const make=(Model,sort={created_at:-1})=>({
 list:async(req,res,next)=>{try{res.json(docs(await Model.find().sort(sort).lean()))}catch(e){next(e)}},
 create:async(req,res,next)=>{try{const x=await Model.create(req.body);res.status(201).json({id:String(x._id),message:"Created",...doc(x)})}catch(e){next(e)}},
 update:async(req,res,next)=>{try{const x=await Model.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});if(!x)return res.status(404).json({message:"Record not found"});res.json({message:"Updated",...doc(x)})}catch(e){next(e)}},
 remove:async(req,res,next)=>{try{await Model.findByIdAndDelete(req.params.id);res.json({message:"Deleted"})}catch(e){next(e)}}
});
export const traffic=make(Traffic); export const parking=make(Parking,{name:1}); export const transport=make(Transport,{route_number:1}); export const authority=make(Authority,{name:1}); export const alert=make(Alert,{created_at:-1}); export const announcement=make(Announcement,{publish_date:-1});
export async function listFavorites(req,res,next){try{res.json(docs(await Favorite.find({user_id:req.user.id}).sort({created_at:-1}).lean()))}catch(e){next(e)}}
export async function addFavorite(req,res,next){try{const x=await Favorite.create({...req.body,user_id:req.user.id});res.status(201).json({message:"Added to favorites",...doc(x)})}catch(e){next(e)}}
export async function removeFavorite(req,res,next){try{await Favorite.deleteOne({_id:req.params.id,user_id:req.user.id});res.json({message:"Removed"})}catch(e){next(e)}}
export async function listAlerts(req,res,next){try{res.json(docs(await Alert.find().sort({created_at:-1}).lean()))}catch(e){next(e)}}
export async function createAlert(req,res,next){try{const x=await Alert.create(req.body);res.status(201).json({id:String(x._id)})}catch(e){next(e)}}
export async function deleteAlert(req,res,next){try{await Alert.findByIdAndDelete(req.params.id);res.json({message:"Alert deleted"})}catch(e){next(e)}}
export async function listAnnouncements(req,res,next){try{res.json(docs(await Announcement.find({$or:[{expiry_date:null},{expiry_date:{$gte:new Date()}}]}).sort({publish_date:-1}).lean()))}catch(e){next(e)}}
export async function createAnnouncement(req,res,next){try{const x=await Announcement.create({...req.body,publish_date:req.body.publish_date||new Date()});res.status(201).json({id:String(x._id)})}catch(e){next(e)}}
export async function deleteAnnouncement(req,res,next){try{await Announcement.findByIdAndDelete(req.params.id);res.json({message:"Announcement deleted"})}catch(e){next(e)}}
