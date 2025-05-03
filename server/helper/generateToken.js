import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 60 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
