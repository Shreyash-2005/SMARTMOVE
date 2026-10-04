import dotenv from "dotenv";
dotenv.config();
export const env={
 port:Number(process.env.PORT||5000),
 frontendOrigin:process.env.FRONTEND_ORIGIN||"http://localhost:5173",
 jwtSecret:process.env.JWT_SECRET||"change-this-secret",
 mongoUri:process.env.MONGODB_URI||"",
 googleClientId:process.env.GOOGLE_CLIENT_ID||"",
 googleMapsApiKey:process.env.GOOGLE_MAPS_API_KEY||process.env.VITE_GOOGLE_MAPS_API_KEY||"",
 googleRoutesApiKey:process.env.GOOGLE_ROUTES_API_KEY||process.env.GOOGLE_MAPS_API_KEY||"",
 tripShareBaseUrl:process.env.TRIP_SHARE_BASE_URL||"http://localhost:5173"
};
