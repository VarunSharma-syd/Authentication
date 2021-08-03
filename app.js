require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

/////////////////Connecting to the database server running locally//////////////////
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

///Not a Simple javacript object but it is a mongoose schema object//////

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

// const secret = "WelcomeTOMyHome";

//This will encyrpt the password into database. encryptedFields array will encrypt only certain items mentioned into the array///
// When we ues mongoose method save or findOne it automatically encrypt or decrypt the encryptedFields
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){

  res.render("home");
});

app.get("/login", function(req,res){

  res.render("login");
});

app.get("/register", function(req,res){

  res.render("register");
});

app.get("/secrets", function(req,res){

  res.render("secrets");
});

/*
app.get("/", function(req,res){

  res.render("submit");
});
*/

app.post("/register", function(req,res){

//Creating a New User
  const newUser = new User({
    email:req.body.username,   // getting email from post body
    password:req.body.password
  });

  newUser.save(function(err){
    if(err){
        res.send(err);
    }
    else {
      res.render("secrets");
    }
  });

});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email:username}, function(err,foundOne){
  if(err){
    res.send("Doesn't Exist in database");
  } else {
    if(foundOne){
      if(foundOne.password=== password)
        res.render("secrets");
      else
        res.send("You entered a wrong password!");
    }
  }
});
});

app.listen(3000,function(){

  console.log("Server is running");
})
