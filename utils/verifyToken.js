import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};

export default verifyToken;
