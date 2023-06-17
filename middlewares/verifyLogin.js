import expressAsyncHandler from "express-async-handler";

import getToken from "../utils/getToken.js";
import verifyToken from "../utils/verifyToken.js";

const verifyLogin = expressAsyncHandler(async (req, res, next) => {
  // Get token from the header
  const token = getToken(req);

  // Verify token
  const decodeUser = verifyToken(token);

  if (!decodeUser) {
    throw new Error("Invalid/Expired token, please login again!");
  } else {
    // Save user into request object
    req.userAuthId = decodeUser?.id;
    next();
  }
});

export default verifyLogin;
