const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv').config();

const app = express();
const port =process.env.PORT ||3000;
const uri = process.env.URI;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);


async function hashpass(password) {
  const res = await bcrypt.hash(password, 10);
  // console.log(res)
  return res;
}

async function compare(userpass, hashpass) {
  const res = await bcrypt.compare(userpass, hashpass);
  // console.log(res)
  return res;
}






app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});

app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = await hashpass(req.body.password);
    const ispresent = await User.findOne({ email });
    if (ispresent) {
      return res.send("user is already registered");
    }

    const createduser = await User.create({ email, password });
    return res.sendFile(__dirname + "/login.html");
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const ispresent = await User.findOne({ email });

    if (!ispresent) {
      // return res.send("user is not registered");
      return res.sendFile(__dirname + "/register.html");
    } else {
      const res1 = await bcrypt.compare(req.body.password, ispresent.password);

      if (!res1) {
        res.send("invalid password ");
      } else {
        res.sendFile(__dirname + "/secrets.html");
      }
    }
  } catch (error) {
    res.send({ error: error.message });
  }
});
app.get("/logout",(req,res)=>{
  res.sendFile(__dirname+"/register.html")
});

app.listen(port, function () {
  console.log(`ported on port ${port}`);
});
