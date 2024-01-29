import jwt from "jsonwebtoken";



export function createTokenForUser(user){
    const payload = {
        _id: user._id,
        name:user.name,
        email:user.email,
        profile:user.profile,
        role:user.role,
    }

    const token = jwt.sign(payload, process.env.SECRET);

    return token
}

export function validateToken(token)
{
    const payload = jwt.verify(token, process.env.SECRET);

    return payload;
}