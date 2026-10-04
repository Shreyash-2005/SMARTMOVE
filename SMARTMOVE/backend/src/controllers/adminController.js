import {User,Traffic,Parking,Transport,Issue,Journey,TripSession} from '../models/all.js';
export async function dashboard(req,res,next){try{
 const [users,traffic,parking,transport,issues,journeys,trips,issueCats,trafficLevels,issueStatus]=await Promise.all([
  User.countDocuments(),Traffic.countDocuments(),Parking.countDocuments(),Transport.countDocuments(),Issue.countDocuments(),Journey.countDocuments(),TripSession.countDocuments(),
  Issue.aggregate([{$group:{_id:'$category',count:{$sum:1}}},{$sort:{count:-1}}]),
  Traffic.aggregate([{$group:{_id:'$congestion_level',count:{$sum:1}}},{$sort:{count:-1}}]),
  Issue.aggregate([{$group:{_id:'$status',count:{$sum:1}}},{$sort:{count:-1}}])
 ]);
 const activeTrips=await TripSession.countDocuments({status:'ACTIVE',expires_at:{$gt:new Date()}});
 const availableParking=await Parking.aggregate([{$group:{_id:null,available:{$sum:'$available_spaces'},total:{$sum:'$total_spaces'}}}]);
 const recentIssues=await Issue.find().populate('user_id','full_name email').sort({created_at:-1}).limit(8).lean();
 res.json({stats:{users,traffic,parking,transport,issues,journeys,trips,activeTrips,availableParking:availableParking[0]?.available||0,totalParking:availableParking[0]?.total||0},issueCategories:issueCats.map(x=>({name:x._id||'Other',value:x.count})),trafficLevels:trafficLevels.map(x=>({name:x._id||'UNKNOWN',value:x.count})),issueStatus:issueStatus.map(x=>({name:x._id||'UNKNOWN',value:x.count})),recentIssues:recentIssues.map(x=>({...x,id:String(x._id),user_name:x.user_id?.full_name||'User'}))});
 }catch(e){next(e)}}
