import {config} from "dotenv"
import express from "express";
import path from "path";
import userRoute from "./routes/user.js"
import blogRoute from "./routes/blog.js"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import {checkForAuthenticationCookie} from "./middleware/authenticationMiddleware.js";
import { Blog } from "./models/blog.js";

config({
  path:"./data/config.env",
})
const app = express();

mongoose
.connect(process.env.MONGO_URL, {
  dbName: "Blogs",
})
.then(() => console.log("Database connected"))
.catch((e) => console.log(e));
//require static assets from public folder 
app.use(express.static(path.resolve() + "/public"));
// Set 'views' directory for any views 
app.set("views", path.resolve("./views"))
// Set view engine as EJS
app.set("view engine", "ejs")


app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(checkForAuthenticationCookie("token"));



app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/" ,async (req,res)=>{
  const allBlogs = await Blog.find({});
  console.log(path.join(path.resolve() , "../public"));
   res.render("home",{
    user:req.user,
    blogs:allBlogs,
   });
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})