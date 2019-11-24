const express = require("express");
let planRouter = express.Router();

let {
  getAllPlans,
  getPlan,
  deletePlan,
  topplans,
  updatePlan,
  createPlan
} = require("../controller/plancontroller");
let {
  protectRoute,
  authorize,
  authorizeeasy
} = require("../controller/authController");
// handlers
// routers
planRouter
  .route("")
  .get(getAllPlans) 
  .post(protectRoute, authorize("admin", "restaurant-owner"), createPlan);
planRouter.route("/top-5-plans").get(topplans, getAllPlans);
planRouter
  .route("/:id")
  .get(getPlan)
  .patch(updatePlan)
  .delete(deletePlan);
module.exports = planRouter;
