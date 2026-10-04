import app from './app.js'; import {env} from './config/env.js'; import {connectDb} from './config/db.js';
connectDb().then(()=>app.listen(env.port,()=>console.log(`SMARTMOVE API running on http://localhost:${env.port}`))).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1)});
