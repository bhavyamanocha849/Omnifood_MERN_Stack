// imports
const express = require("express");
const planRouter = require("./router/planRouter");
const userRouter = require("./router/userRouter");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const viewRouter = require("./router/viewRouter");
const bookingRouter=require("./router/bookingRouter");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Limit crossed by your IP" //Limit to each IP 100 requests every 15 mins
});
const cookieParser=require("cookie-parser");
const app = express();
// Middle ware
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser(),(req,res,next)=>{
  next();
});
app.set("view engine", "pug");
app.set("views", "template");
app.use(mongoSanitize());
app.use(limiter);
app.use(helmet());
app.use(express.urlencoded({extended:true}));
//Routers
app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings",bookingRouter);
app.use("/", viewRouter);

// server
module.exports = app;

// const fs = require("fs");
// app.use(express());
// Middleware

// app.use("/",(req,res,next)=>{
//   console.log("Hi from middleWare 👌👌");
//   next();
// })
// handler function
// routes
// Routers=> incoming path => middlewares
// define

// app.get("/api/plans", getAllPlans);
// app.get("/api/user");
// app.get("/api/plans/:id", getPlan);
// app.get("/api/user/:id", getUser);

// app.post("/api/plans", createPlan);
// app.post("/api/user");

// app.patch("/api/plans/:id", updatePlan);
// app.patch("/api/user/:id", updateUser);

// app.delete("/api/plans/:id", deleteUser);
// app.delete("/api/user/:id", deletePlan);
