import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// =============== Sign Up ==============
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res.status(201).json({ message: "Sign up Successfully!" });
  } catch (error) {
    return next(error);
  }
};

// =============== Sign In ==============
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Add expiration to token for security
    });

    // Exclude password from user data in the response
    const { password: pass, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }) // Add secure flag if in production
      .json({
        message: "Signed in successfully!",
        user: rest, // Send user details excluding the password
      });
  } catch (error) {
    return next(error);
  }
};
