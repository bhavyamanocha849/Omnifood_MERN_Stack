const PlanModel = require("../model/planmodel");

module.exports.topplans = (req, res, next) => {
  req.query.sort = "price%ratingsAverage";
  req.query.fields = "name%description%ratingsAverage";
  req.query.limit = 5;
  next();
};

module.exports.deletePlan = async (req, res) => {
  let id = req.params["id"];
  try {
    let result = await PlanModel.findByIdAndDelete(id);
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

module.exports.getPlan = async (req, res) => {
  let id = req.params["id"];
  try {
    let result = await PlanModel.findById(id);
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
module.exports.getAllPlans = async (req, res) => {
  try {
    var queryObj = { ...req.query };
    let excludeFromQuery = ["fields", "limit", "page", "sort"];
    let query = req.query;
    for (let i = 0; i < excludeFromQuery.length; i++) {
      delete queryObj[excludeFromQuery[i]];
    }
    // console.log(req.query);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => {
      return "$" + match;
    });
    queryObj = JSON.parse(queryString);
    let result = PlanModel.find(queryObj);
    if (query.sort) {
      var args = query.sort.split("%").join(" ");
      result = result.sort(args);
    }
    if (query.fields) {
      var args = query.fields.split("%").join(" ");
      result = result.select(args);
    } else {
      result = result.select("-__v");
    }
    let limitPerPage = Number(query.limit) || 2;
    let page = Number(query.page) || 1;
    let elementToskip = (page - 1) * limitPerPage;
    result = result.skip(elementToskip).limit(limitPerPage);
    res.status(200).json({
      result: await result
    });
  } catch (err) {
    res.status(401).json({
      status: "Bad Request",
      err: err
    });
  }
};
module.exports.updatePlan = async (req, res) => {
  let id = req.params["id"];
  try {
    let result = await PlanModel.findByIdAndUpdate(id, req.body, { new: true });
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
module.exports.createPlan = async (req, res) => {
  try {
    var result = await PlanModel.create(req.body);
    res.status(201).json({ result: result });
  } catch (err) {
    res.status(401).json({
      status: "bad request",
      err: err
    });
    // console.log(err);
  }
};
