import jwt from "jsonwebtoken";


export default function accessToken(user){
    
    return jwt.sign(
   
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC,
    { expiresIn: "1d" }
  )};


  