const nodemailer = require("nodemailer");
const {emailPass,adminEmail} = require("./config");
module.exports.sendEmail = async function(options) {
  //1. Create transporter
  let transporter = nodemailer.createTransport({
    service:"gmail" ,
    host: "smtp.gmail.com",
    auth: {
      user: adminEmail,
      pass: emailPass
    }
  });
  let emailOptions = {
    from: '"Omnifood 👻" <service@omnifood.com>', // sender address
    to: options.receiverId, // list of receivers
    subject: options.subject + "✔", // Subject line
    text: options.message // plain text body
    // html: "<b>Hello world?</b>" // html body Can be sent too!
  };
  await transporter.sendMail(emailOptions);
};
