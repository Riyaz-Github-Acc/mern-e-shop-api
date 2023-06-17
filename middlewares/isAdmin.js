import expressAsyncHandler from "express-async-handler";

import User from "../model/userModel.js";

const isAdmin = expressAsyncHandler(async (req, res, next) => {
  // Get the user
  const user = await User.findById(req.userAuthId);

  // Check if the user is admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error("Access denied, admin only!"));
  }
});

export default isAdmin;
