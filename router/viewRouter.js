const express = require("express");
let viewRouter = express.Router();
let {
  viewHomePage,
  viewLoginPage,
  viewPlansPage,
  viewForgetPage,
  viewUserPage,
  viewUpdatePage,
  viewForgetPassPage,
  viewResetPassPage,
  viewSignUpPage
} = require("../controller/viewController");
let { isLoggedIn, protectRoute } = require("../controller/authController");
viewRouter.use(isLoggedIn);
viewRouter.route("/home").get(viewHomePage);
viewRouter.route("/forgetPassword").get(viewForgetPage);
viewRouter.route("/createPassword").get(viewForgetPassPage);
viewRouter.route("/plans").get(viewPlansPage);
viewRouter.route("/login").get(viewLoginPage);
viewRouter.route("/signup").get(viewSignUpPage);
viewRouter.route("/me").get(viewUserPage);
viewRouter.route("/updateProfile").get(viewUpdatePage);
viewRouter.route("/resetPassword").get(viewResetPassPage);
module.exports = viewRouter;
