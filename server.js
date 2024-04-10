//1-importing the file
import express  from "express";
import colors   from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from "url";
//import (database)
import connectdb from "./config/db.js";
//import (Route)
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
 // "dev": "concurrently \"npm run server\" \"npm run client\""{local host me run karane k liye}

//config env call
dotenv.config()

//database connection
connectdb()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//rest objects 
const app = express();

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/product",ProductRoute)

//rest api
app.use("*",function(req,res){
       res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

//port 
const PORT = process.env.PORT ||8080;

//app listen 
app.listen(PORT,()=>{
   console.log(`server Running  on  ${PORT} port `.bgCyan.white)
})
