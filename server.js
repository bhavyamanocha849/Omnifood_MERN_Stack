const app = require("./app");
const port = process.env.PORT || 80;
// database

//  error handling
app.listen(port, function() {
  console.log("Server has started at port " + port);
});
