import {Notification} from '../models/all.js'; import {docs} from '../utils/serialize.js';
export async function listNotifications(req,res,next){try{res.json(docs(await Notification.find({user_id:req.user.id}).sort({created_at:-1}).lean()))}catch(e){next(e)}}
export async function readNotification(req,res,next){try{await Notification.updateOne({_id:req.params.id,user_id:req.user.id},{$set:{is_read:true}});res.json({message:'Marked as read'})}catch(e){next(e)}}
export async function readAll(req,res,next){try{await Notification.updateMany({user_id:req.user.id},{$set:{is_read:true}});res.json({message:'All notifications marked as read'})}catch(e){next(e)}}
export async function deleteNotification(req,res,next){try{await Notification.deleteOne({_id:req.params.id,user_id:req.user.id});res.json({message:'Deleted'})}catch(e){next(e)}}
