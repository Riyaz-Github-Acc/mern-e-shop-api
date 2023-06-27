import jwt from "jsonwebtoken";

const refreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export default refreshToken;
