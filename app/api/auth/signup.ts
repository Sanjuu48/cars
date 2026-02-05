import type {NextApiRequest, NextApiResponse} from "next";

let users:{email:string;password:string}[] = [];

export default function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({message:"Method not allowed"});
    }

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }

    if(users.find(u=>u.email===email)){
        return res.status(409).json({error:"User already exists"});
    }
    users.push({email,password});
    return res.status(201).json({message:"User registered successfully"});
}