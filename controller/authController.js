const UserModel = require("../model/usermodel");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = "secretKey";
const crypto = require("crypto");
let { sendEmail } = require("../utils/email");
module.exports.loginUser = async (req, res) => {
  try {
    let data = req.body;
    let { email, password } = data;
    if (!email || !password) {
      res.end("Email or Password is not present!");
      return;
    }
    let userData = await UserModel.findOne({
      email: email
    });
    if (!userData) {
      res.end("User Not Found!");
      return;
    }
    let dbPassword = userData.password;
    let ans = await bcrypt.compare("" + password, dbPassword);
    if (!ans) {
      res.end("Wrong Password!");
      return;
    }
    //   res.status(200).end("user logged in");
    const JWTtoken = jsonwebtoken.sign({ result: userData["_id"] }, secret, {
      expiresIn: "2d"
    });
    res.cookie("jwt", JWTtoken, { httpOnly: true });
    res.status(201).json({
      status: "Success LogIn",
      token: JWTtoken,
      message: "Welcome " + userData.Name
    });
  } catch (err) {
    console.log(err);
    res.status(501).json({
      message: "Bad Request"
    });
  }
  //   let email = data.email;
  //   let password = data.password;
};
module.exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
      // console.log(token);
      let decode = jsonwebtoken.verify(token, secret);

      if (!decode) {
        return next();
      }
      // console.log(decode);

      const user = await UserModel.findById(decode.result);
      // console.log(decode.id);
      // console.log(user);
      if (!user) {
        return next();
      }
      req.headers.role = user.role;
      user.password = undefined;
      res.locals.user = user;

      // console.log(res.locals.user);
      return next();
    } else {
      return next();
    }
  } catch (err) {
    console.log(err);
    next();
  }
};
module.exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "Logged Out", {
    expires: new Date(Date.now() + 20),
    httpOnly: true
  });
  res.status(201).json({
    status: "Success LogOut",
    message: "User Logged Out"
  });
};
module.exports.userSignUp = async (req, res) => {
  try {
    let data = req.body;
    //   let email = data.email;
    //   let password = data.password;
    let { email, password } = data;
    if (!email || !password) {
      res.end("Email or Password is not present!");
    }
    let user = await UserModel.create(data);
    const token = jsonwebtoken.sign({ result: user._id }, secret, {
      expiresIn: "10d"
    });
    
    res.status(201).json({
      status: "Success SignUp",
      token
    });
    let message =
    "Welcome to OmniFood! " + user.Name;
    try {
      sendEmail({
        receiverId: user.email,
        message: message,
        subject: "Welcome to Omnifood"
      });
      res.json({
        status: "Email Sent"
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    // res.end(err);
    console.log(err);
  }
};
module.exports.protectRoute = async (req, res, next) => {
  try {
    // 1. check token exist's or not
    // console.log(req.headers);
    // console.log(req.headers.authorization);
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      res.end("User is not logged in ");
    }
    // 2. verify the token
    let decode = jsonwebtoken.verify(token, secret);
    if (!decode) {
      res.end("User is not authenticated");
    }
    // console.log(decode);
    // 3. check that user associated with the token exist in db or not
    // user name:steve
    //role:admin
    const user = await UserModel.findById(decode.result);
    if (!user) {
      res.end("user does not exist");
    }
    // 4. password update
    // db => ADMIN,User
    req.headers.role = user.role;
    // user.password = undefined;
    req.headers.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    // res.json(err);
    console.log(err);
  }
};
module.exports.authorize = function(...args) {
  let roles = args;
  return function(req, res, next) {
    if (roles.includes(req.headers.role)) {
      next();
    } else {
      res.end("user is not authorized");
    }
  };
};
module.exports.authorizeeasy = (req, res, next) => {
  if (req.headers.role === "admin" || req.headers.role === "restaurant-owner") {
    next();
  } else {
    res.end("user is not authorized");
  }
};
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    req.end("Please enter your email id");
  }
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    res.end("User not found");
  }
  let token = user.createResetToken();
  await user.save({ validateBeforeSave: false });
  let message =
    "Your reset token is sent! Please visit /createPassword and change password using provided token \n" +
    token;
  try {
    sendEmail({
      receiverId: user.email,
      message: message,
      subject: "Token only valid for 10mins"
    });
    res.json({
      status: "Email Sent"
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.resetPassword = async (req, res) => {
  //1. get Token from user
  console.log(req.body);
  let token = req.body.token;
  if (!token) {
    res.end("Enter token");
  }

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  //2. verify token
  console.log(encryptedToken);
  let user = await UserModel.findOne({ resetToken: encryptedToken});
  if (!user) {
    res.end("Invalid Auth token");
    return;
  }
  //3. Update password
  console.log(user);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.expiresIn = undefined;
  user.save();
  res.json({
    status: "User Password Updated"
  });
};
module.exports.updateMyPassword = async (req, res) => {
  //  currentPassword,NewPassword,confirmPassword
  console.log(req.body);
  const dbPassword = req.headers.user.password;
  // ui

  const password = req.body.currentPassword;
  console.log(dbPassword+" "+password);
  // db
  const user = req.headers.user;
  let ans = await bcrypt.compare("" + password, dbPassword);
  if (!ans) {
    // new Error("Password was wrong")
    res.end("password is wrong");
    return;
  }
  //  model user password update
  console.log(user);
  user.password = req.body.NewPassword;
  user.confirmPassword = req.body.confirmPassword;
  // validators
  user.save();
  // send tokens
  // const JWTtoken = jsonwebtoken.sign({ id: user._id }, secret, {
  //   expiresIn: "10d"
  // });
  // res.cookie("jwt", JWTtoken, { httpOnly: "true" });
  res.json({
    status: "user Password Updated"
  });
};
