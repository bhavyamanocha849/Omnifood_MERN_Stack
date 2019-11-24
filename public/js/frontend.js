const loginForm1 = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");
const logoutbtn = document.querySelector(".logoutBtn");
const meForm = document.querySelector(".update-form");
const resetForm = document.querySelector(".reset-form");
const forgetEmailForm = document.querySelector(".forget-form");
const forgetPassForm = document.querySelector(".forgetPass-form");
const stripe=Stripe("pk_test_9nwVMlM2AMPA6n57Uk400q5p00PiCpVEJX");
const bookButtons=document.querySelectorAll(".bookPlan");
const bookPlan=async planId=>{
  try{
    const session=await axios.get(`/api/bookings/checkout-session/${planId}`);
    // console.log(session);
  const res=  await stripe.redirectToCheckout({
      sessionId:session.data.session.id
    });
  }
  catch(err){
    console.log(err);
  }
};
const resetPassword = async (currPassword, password, confirmPassword) => {
  if (password !== confirmPassword) {
    alert(
      "New passowrd and curr password fields don't match! Please try again"
    );
    location.reload();
    return;
  }
  try {
    let data = {
      currentPassword: currPassword,
      NewPassword: password,
      confirmPassword: confirmPassword
    };
    const res = await axios.patch("api/users/updatePassword", data);
    if (res.data.status === "user Password Updated") {
      alert("Password changed!");
      window.setTimeout(() => {
        location.assign("/me");
      }, 1000);
    } else {
      alert("Something went wrong! Please try again");
    }
  } catch (err) {
    console.log(err);
  }
};
const signUp = async data => {
  try {
    const res = await axios.post("/api/users/signup", data);
    if (res.data.status === "Success SignUp") {
      alert(
        "New User created! Please go back to login page to access your account!"
      );
      window.setTimeout(() => {
        location.assign("/home");
      }, 1000);
    } else {
      alert("Something went wrong! Please try again");
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const logout = async () => {
  try {
    const res = await axios.get("/api/users/logout");
    if (res.data.status === "Success LogOut") {
      alert("User logged out");
      window.setTimeout(() => {
        location.assign("/home");
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const updateUser = async (name, email) => {
  try {
    const res = await axios.patch("/api/users/updateUser", {
      Name: name,
      email: email
    });
    if (res.data.status === "Update Success") {
      alert("Your data was updated!");
      console.log(res.data.result);
      window.setTimeout(() => {
        location.assign("/me");
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const changePassword = async data => {
  try {
    const res = await axios.patch("/api/users/resetPassword", data);
    if (res.data.status === "User Password Updated") {
      alert("Your password has been updated! Please try login");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1000);
    } else {
      alert("Something went wrong! Please try again");
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const sendToken = async emailId => {
  try {
    const res = await axios.post("api/users/forgotPassword", {
      email: emailId
    });
    if (res.data.status === "Email Sent") {
      alert("Email has been sent to your email! Please check and reset pasword");

      window.setTimeout(() => {
        location.assign("/createPassword");
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const login = async (email, password) => {
  try {
    const res = await axios.post("/api/users/login", {
      email: email,
      password: password
    });
    console.log(res.data);

    if (res.data.status === "Success LogIn") {
      alert(res.data.status + "! " + res.data.message);
      window.setTimeout(() => {
        location.assign("/home");
      }, 1000);
    } else {
      alert("Wrong email id and Password combination! Please try again");
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
  //   alert("Hello " + email + " => " + password);
};
//
if(bookButtons){
  // console.log("Found!");
  console.log(bookButtons);
  for(let i=0;i<bookButtons.length;i++){
   
    bookButtons[i].addEventListener("click",e=>{
      console.log("Found!");
      e.preventDefault();
      let planId=e.target.dataset.planId;
      console.log(planId);
      bookPlan(planId);
    });
  }
}
if (loginForm1) {
  // console.log(loginForm1);
  loginForm1.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (logoutbtn) {
  logoutbtn.addEventListener("click", e => {
    logout();
  });
}
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const Name = document.getElementById("Name").value;
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
      alert("Passwords dont match! Please try again!");
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
    const data = {
      Name: Name,
      userName: userName,
      password: password,
      confirmPassword: confirmPassword,
      email: email
    };
    signUp(data);
  });
}
if (meForm) {
  meForm.addEventListener("submit", e => {
    e.preventDefault();
    const Name = document.getElementById("Name").value;
    const email = document.getElementById("email").value;
    // console.log(Name);
    updateUser(Name, email);
  });
}
if (forgetPassForm) {
  forgetPassForm.addEventListener("submit", e => {
    e.preventDefault();
    const token = document.getElementById("token").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    let data = {
      token: token,
      password: password,
      confirmPassword: confirmPassword
    };
    changePassword(data);
  });
}
if (forgetEmailForm) {
  forgetEmailForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    sendToken(email);
  });
}
if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault();
    const currPassword = document.getElementById("currpassword").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    resetPassword(currPassword, password, confirmPassword);
  });
}
