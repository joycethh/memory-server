import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(404).json({ mssg: `User doesn't exist` });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400)({ mssg: "Invalid password/credentials" });

    //if user existed & password correct, then we asign a web token to the user so the user can stay login for a certain amount of time.
    //we will neeed user info, secret, session time.
    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existUser, token });
  } catch (error) {
    res.status(500).json({ mssg: "Something went wrong" });
    console.log(error);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).json({ mssg: `User already exists` });
    if (password !== confirmPassword)
      return res.status(400).json({ mssg: `Password doesn't match` });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ mssg: "Something went wrong" });
    console.log(error);
  }
};
