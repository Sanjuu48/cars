import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../lib/db";
import User from "../models/User";

type UserType = {
  _id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserType[] | ErrorResponse>
) {
  try {
    await dbConnect();

    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    const formattedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
