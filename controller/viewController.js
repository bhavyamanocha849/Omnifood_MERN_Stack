const PlanModel = require("../model/planmodel");
let { isLoggedIn } = require("./authController");
module.exports.viewHomePage = async (req, res) => {
  let allPlans = await PlanModel.find();
  allPlans = allPlans.slice(0, 3);
  res.status(401).render("home.pug", {
    plans: allPlans
  });
};
module.exports.viewForgetPage=async (req,res)=>{
  res.status(401).render("resetEmail.pug", {
    title: "Forgot Password"
  });
}
module.exports.viewForgetPassPage=async (req,res)=>{
  res.status(401).render("forgotPass.pug", {
    title: "Create new Password"
  });
}
module.exports.viewResetPassPage=async (req,res)=>{
  res.status(401).render("resetPass.pug", {
    title: "Update Password"
  });
}
module.exports.viewPlansPage = async (req, res) => {
  let allPlans = await PlanModel.find();
  res.status(401).render("_plan.pug", {
    plans: allPlans
  });
};
module.exports.viewLoginPage = async (req, res) => {
  res.status(401).render("login.pug", {
    title: "Login Page"
  });
};

module.exports.viewSignUpPage = async (req, res) => {
  res.status(401).render("signup.pug", {
    title: "Register"
  });
};
module.exports.viewUserPage = async (req, res) => {
  res.status(401).render("user.pug", {
    title: "Profile"
  });
};
module.exports.viewUpdatePage=async (req,res)=>{
  res.status(401).render("updateProfile.pug",{
    title:"Update Your Profile"
  });
}
