const express=require("express");
let bookingRouter=express.Router();
let{protectRoute}=require("../controller/authController");
let {getCheckout}=require("../controller/bookingController");
bookingRouter.route("/checkout-session/:id").get(protectRoute,getCheckout);
module.exports=bookingRouter;
