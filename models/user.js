import mongoose, { Schema, model } from "mongoose";
import crypto, { createHmac, randomBytes } from "crypto";
import { createTokenForUser} from "../services/authentication.js";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    profile:{
        type:String,
        default:"/images/default.png",
    },
    role:{
        type:String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
},
{timestamps:true},
);

userSchema.pre("save", function (next){
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenrateToken", async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("user not found");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = crypto.createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect password");


    const token = createTokenForUser(user);
    return token;

});

export const User = model("user", userSchema);