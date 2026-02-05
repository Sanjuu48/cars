import { NextApiRequest,NextApiResponse } from "next";

let users:{email:string;password:string}[] = [];

export default function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({message:"Method not allowed"});
    }

    const {email,password}=req.body;

    const user =users.find(u=>u.email===email && u.password===password);

    if(!user){
        return res.status(401).json({message:"Invalid email or password"});
    }
    return res.status(200).json({message:"Signin successful",email});
}