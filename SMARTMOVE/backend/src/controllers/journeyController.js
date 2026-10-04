import {Journey} from '../models/all.js'; import {doc,docs} from '../utils/serialize.js';
export async function createJourney(req,res,next){try{const x=await Journey.create({...req.body,user_id:req.user.id});res.status(201).json({id:String(x._id),...doc(x)})}catch(e){next(e)}}
export async function listJourneys(req,res,next){try{res.json(docs(await Journey.find({user_id:req.user.id}).sort({created_at:-1}).lean()))}catch(e){next(e)}}
export async function deleteJourney(req,res,next){try{await Journey.deleteOne({_id:req.params.id,user_id:req.user.id});res.json({message:'Journey deleted'})}catch(e){next(e)}}
