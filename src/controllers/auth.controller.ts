import { Request, Response } from "express";
import { UserModel } from "../models/users.model";
import { comparePassword, createJwt, verifyJwt } from "../utils/helpers";
import CustomError from "../utils/error/CustomError";
import { tryCatch } from "../utils/tryCatch";
import {
  emailBodySchema,
  loginBodySchema,
  passwordResetSchema,
  registerBodySchema,
} from "../validators/auth.validators";
import { sendEmail } from "../utils/emails/sendEmail2";
import { resetPasswordTemplate, resetSuccessTemplate } from "../utils/emails/emailTemplates";
import { hashPassword } from "../utils/helpers/index";



// login
export const authRegister = tryCatch(async (req: Request, res: Response) => {
  const { name, email, password } = registerBodySchema.parse(req.body);

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await UserModel.create({
    name,
    email,
    password: passwordHash,
  });

  const accessToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 10 * 60 },
  );

  res.status(201).json({ accessToken, message: "User created successfully" });
});



export const authLogin = tryCatch(async (req: Request, res: Response) => {
  const data = loginBodySchema.parse(req.body);
  const { email, password } = data;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const accessToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 15 * 60 }, //expire in 15 minute
  );

  const refreshToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 24 * 60 * 60 },
  )

  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  const userData = {
    name: user.name,
    email: user.email,
    accessToken,
  };
  user.refreshToken = refreshToken;
  await user.save();
  return res.status(201).json({ status: "success", user: userData });
});

//
export const getToken = tryCatch(async (req: Request, res: Response) => {
  const refresh = req.cookies["refresh"];
  const decoded = verifyJwt(refresh);
  const user = await UserModel.findOne({ _id: decoded.userId })
    .select("+refreshToken")
    .lean();
  if (!user.refreshToken === refresh) {
    throw new CustomError("Not Authorized", 400);
  }
  const accessToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 15 * 60 }, //expire in 15 minute
  );
  const refreshToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 24 * 60 * 60 },
  )
  user.refreshToken = refreshToken;
  return res.status(200).json({ accessToken,refreshToken });
});

export const forgetPassword = tryCatch(async (req: Request, res: Response) => {
  const data = emailBodySchema.parse(req.body);
  const { email } = data;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid Credentials", 400);
  }

  const token = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 10 * 60 },
  );

  const link = `${process.env.CLIENT_URL}/reset-password/?token=${token}`;
  const subject = "Password Reset Request";
  const duration = "10 minutes";
  const html = resetPasswordTemplate({ name: user.name, link, duration });

  sendEmail({ email: user.email, subject, html });

  return res.status(200).json({
    status: "success",
    message:
      "Password email reset sent, Kindly check your email to reset your password",
  });
});

export const confirmPasswordReset = tryCatch(
  async (req: Request, res: Response) => {
    const tokenParams = req.params.token;
    const { token, password } = passwordResetSchema.parse({
      token: tokenParams,
      ...req.body,
    });

    const decode = verifyJwt(token);
    const passwordHash = await hashPassword(password);

    const user = await UserModel.findOne({ _id: decode.userId });
    if (!user) {
      throw new CustomError("User not found", 400);
    }
    user.password = passwordHash;
    user.save();
    const html = resetSuccessTemplate({ name: user.name });
    const subject = "Password Reset Successful";
    sendEmail({ email: user.email, subject, html });
    return res
      .status(201)
      .json({ status: "success", message: "Password Successfully Reset" });
  },
);
