const stripe = require("stripe")("sk_test_tofJWHXtrBf1WH1XeQ1r0s6j00qK8ttevU");
const planModel = require("../model/planmodel");
module.exports.getCheckout = async (req, res) => {
  var id = req.params["id"];
  const plan = await planModel.findById(id);
  console.log(plan);
  // res.end(plan);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: `${plan.name}`,
        description: `${plan.description}`,
        images: ["https://example.com/t-shirt.png"],
        amount: `${plan.price}00`,
        currency: "usd",
        quantity: 1
      }
    ],
    success_url: "http://localhost:3000/home",
    cancel_url: "https://localhost:3000/login"
  });
  res
    .status(201)
    .json({ status: "payment for " + plan.name + " made", session: session });
};
