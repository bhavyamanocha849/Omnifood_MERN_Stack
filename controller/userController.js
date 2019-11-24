const UserModel = require("../model/usermodel");
module.exports.getAllUser = async (req, res) => {
  var queryObj = { ...req.query };
  let excludeFromQuery = ["fields", "limit", "page", "sort"];
  for (let i = 0; i < excludeFromQuery.length; i++) {
    delete queryObj[excludeFromQuery[i]];
  }
  try {
    let result = await UserModel.find(queryObj);
    res.status(200).json({
      result: result
    });
  } catch (err) {
    res.status(401).json({
      status: "Bad Request",
      err: err
    });
  }
};
module.exports.getUser = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await UserModel.findById(id);
    res.status(200).json({
      result: result
    });
  } catch (err) {
    res.status(401).json({
      status: "Bad Request",
      err: err
    });
  }
};
module.exports.createUser = async (req, res) => {
  try {
    var result = await UserModel.create(req.body);
    res.status(201).json({ result: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "bad request",
      err: err
    });
    // console.log(err);
  }
};

module.exports.updateUser = async (req, res) => {
  let id = req.params["id"] || req.headers.user["_id"];
  try {
    let result = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      result: result,
      status:"Update Success"
    });
  } catch (err) {
    res.status(401).json({
      status: "Bad Request",
      err: err
    });
  }
};
module.exports.deleteUser = async (req, res) => {
  let id = req.params["id"];
  try {
    let result = await UserModel.findByIdAndDelete(id);
    res.status(200).json({
      result: result
    });
  } catch (err) {
    res.status(401).json({
      status: "Bad Request",
      err: err
    });
  }
};
