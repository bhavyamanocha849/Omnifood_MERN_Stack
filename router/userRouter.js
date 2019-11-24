const express = require("express");
let userRouter = express.Router();
let {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUser
} = require("../controller/userController");
let {
  loginUser,
  userSignUp,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateMyPassword,
  protectRoute
} = require("../controller/authController");
// handler
// routers
userRouter
  .route("")
  .get(getAllUser)
  .post(createUser);
// userRouter.use(function(req, res, next) {
//   console.log(req.url);
//   console.log(req.method);
//   next();  
// });
userRouter.route("/updateUser").patch(protectRoute, updateUser);
userRouter.route("/updatePassword").patch(protectRoute, updateMyPassword);
userRouter.route("/signup").post(userSignUp);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/resetPassword").patch(resetPassword);

userRouter
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
