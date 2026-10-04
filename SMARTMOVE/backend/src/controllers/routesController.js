import { env } from "../config/env.js";

function decodePolyline(encoded) {
  let index=0, lat=0, lng=0, points=[];
  while(index<encoded.length){
    let shift=0,result=0,b;
    do { b=encoded.charCodeAt(index++)-63; result|=(b&31)<<shift; shift+=5; } while(b>=32);
    lat += (result&1) ? ~(result>>1) : (result>>1);
    shift=0; result=0;
    do { b=encoded.charCodeAt(index++)-63; result|=(b&31)<<shift; shift+=5; } while(b>=32);
    lng += (result&1) ? ~(result>>1) : (result>>1);
    points.push([lat/1e5,lng/1e5]);
  }
  return points;
}

function modeFor(mode) {
  return ({CAR:"DRIVE",BIKE:"TWO_WHEELER",WALKING:"WALK",BUS:"TRANSIT",TRAIN:"TRANSIT"}[mode] || "DRIVE");
}

export async function computeRoute(req,res,next){
  try {
    if (!env.googleRoutesApiKey) return res.status(503).json({message:"Google Routes API is not configured. Add GOOGLE_ROUTES_API_KEY to backend/.env."});
    const {origin,destination,mode="CAR",preferences={}}=req.body||{};
    if (!origin?.latitude || !origin?.longitude || !destination?.latitude || !destination?.longitude) return res.status(400).json({message:"Valid origin and destination coordinates are required."});
    const travelMode=modeFor(mode);
    const trafficCapable=travelMode === "DRIVE" || travelMode === "TWO_WHEELER";
    const body={
      origin:{location:{latLng:{latitude:Number(origin.latitude),longitude:Number(origin.longitude)}}},
      destination:{location:{latLng:{latitude:Number(destination.latitude),longitude:Number(destination.longitude)}}},
      travelMode,
      routingPreference: trafficCapable ? "TRAFFIC_AWARE" : "TRAFFIC_UNAWARE",
      computeAlternativeRoutes:trafficCapable,
      polylineQuality:"HIGH_QUALITY",
      languageCode:"en-US", units:"METRIC"
    };
    if (trafficCapable) body.extraComputations=["TRAFFIC_ON_POLYLINE"];
    const accessibility=String(preferences.accessibility||"none");
    const avoidHighways=Boolean(preferences.avoidHighways);
    const avoidTolls=Boolean(preferences.avoidTolls);
    const avoidFerries=Boolean(preferences.avoidFerries);
    if(avoidHighways||avoidTolls||avoidFerries) body.routeModifiers={avoidHighways,avoidTolls,avoidFerries};
    if(accessibility!=="none") body.routeModifiers={...(body.routeModifiers||{}),avoidHighways:avoidHighways||mode==="WALKING"};
    const fields=["routes.duration","routes.staticDuration","routes.distanceMeters","routes.polyline.encodedPolyline","routes.description","routes.warnings","routes.travelAdvisory.speedReadingIntervals","routes.legs.steps.navigationInstruction"];
    const r=await fetch("https://routes.googleapis.com/directions/v2:computeRoutes",{method:"POST",headers:{"Content-Type":"application/json","X-Goog-Api-Key":env.googleRoutesApiKey,"X-Goog-FieldMask":fields.join(",")},body:JSON.stringify(body)});
    const data=await r.json();
    if(!r.ok || !data.routes?.length) return res.status(502).json({message:data?.error?.message||"Google Routes could not calculate the trip."});
    const routes=data.routes||[];
    const modeCostPerKm={CAR:8,BIKE:3,BUS:2,TRAIN:1,WALKING:0};
    const modeCo2PerKm={CAR:0.192,BIKE:0.090,BUS:0.080,TRAIN:0.041,WALKING:0};
    const candidates=routes.map((route,index)=>{
      const durationSeconds=parseFloat(String(route.duration||"0").replace("s",""));
      const staticSeconds=parseFloat(String(route.staticDuration||"0").replace("s",""));
      const intervals=(route.travelAdvisory?.speedReadingIntervals||[]).map(x=>({start:Number(x.startPolylinePointIndex||0),end:Number(x.endPolylinePointIndex||0),speed:x.speed||"NORMAL"}));
      const trafficStatus=intervals.some(x=>x.speed==="TRAFFIC_JAM")?"TRAFFIC_JAM":intervals.some(x=>x.speed==="SLOW")?"SLOW":"NORMAL";
      const distanceKm=Number((Number(route.distanceMeters||0)/1000).toFixed(2));
      return {
        id:`route-${index+1}`,
        distanceKm,
        etaMinutes:Math.max(1,Math.ceil(durationSeconds/60)),
        staticEtaMinutes:Math.max(1,Math.ceil(staticSeconds/60)),
        trafficStatus,
        trafficIntervals:intervals,
        points:route.polyline?.encodedPolyline?decodePolyline(route.polyline.encodedPolyline):[],
        warnings:[...(route.warnings||[]),...(accessibility!=="none"?[`Accessibility preference: ${accessibility.replace("_"," ")}. Verify sidewalks/steps locally before travel.`]:[])],
        description:route.description||"",
        estimatedCost:Number((distanceKm*(modeCostPerKm[mode]??5)).toFixed(0)),
        estimatedCo2Kg:Number((distanceKm*(modeCo2PerKm[mode]??0.15)).toFixed(2)),
      };
    });
    const fastest=[...candidates].sort((a,b)=>a.etaMinutes-b.etaMinutes)[0];
    const shortest=[...candidates].sort((a,b)=>a.distanceKm-b.distanceKm)[0];
    const eco=[...candidates].sort((a,b)=>a.estimatedCo2Kg-b.estimatedCo2Kg)[0];
    const labelled=candidates.map((r)=>({...r,labels:[...(fastest?.id===r.id?["Fastest"]:[]),...(shortest?.id===r.id?["Shortest"]:[]),...(eco?.id===r.id?["Eco"]:[]) ]}));
    const primary=labelled.find(r=>r.id===fastest?.id)||labelled[0];
    res.json({...primary,routes:labelled,provider:"Google Routes API",accessibilityPreference:accessibility});
  } catch(e){ next(e); }
}
