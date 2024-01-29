import { Router } from "express";
import { User } from "../models/user.js";
import { createTokenForUser,validateToken} from "../services/authentication.js";




const router = Router();

router.get('/signin', (req,res)=>{
    return res.render("signin");
});

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
   try {
    const token = await User.matchPasswordAndGenrateToken(email,password);
    return res.cookie("token",token,{
        httpOnly:true,
        sameSite:process.env.NODE_ENV === "Development"? "lax" : "none",
        secure:process.env.NODE_ENV === "Development"? false : true,
    }).redirect("/");

   } catch (error) {
    res.render("signin",{
        error:"Incorrect Email or Password",
    })
   }
});

router.get('/signup', (req,res)=>{
    return res.render("signup");
});

router.post('/signup', async (req,res)=>{
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password,
    });

    return res.redirect("/");
});

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/");
})
export default router;