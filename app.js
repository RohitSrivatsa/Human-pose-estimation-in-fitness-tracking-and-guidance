const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const https = require("https");
//const gTTS = require('gtts');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var fname = "";
// var speech = 'Please stand back';
// var gtts = new gTTS(speech, 'en');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// gtts.save('Voice.mp3', function (err, result){
//     if(err) { throw new Error(err); }
//     console.log("Text to speech converted!");
// });

mongoose.connect("mongodb+srv://admin-niharika:test123@cluster0.0f7ty.mongodb.net/phyAptDB", { useNewUrlParser: true, useUnifiedTopology: true });




const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  email: String,
  password: String
});

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const user = new User({
      first: req.body.fname,
      last: req.body.lname,
      email: req.body.username,
      password: hash
    });
    user.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("New registration");
        res.render("login");





      }
    });
    //   fname= req.body.fname;
    //   const username=req.body.username;
    //   const password=req.body.password;
    //   User.findOne({email:username,first:fname},function(err,foundUser){
    //     if(err){
    //       console.log(err);
    //     }else{
    //       if(foundUser){

    //         bcrypt.compare(password, foundUser.password, function(err, result) {
    //     if(result==true){
    //       res.render("home",{username:fname});
    //     }
    // });

    //         }
    //       }



    //   });

  });


});

app.post("/login", function (req, res) {
  fname = req.body.fname;
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username, first: fname }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {

        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result == true) {
            res.render("home",{name:fname});
          }
        });

      }
    }



  });
});

app.get("/home", function (req, res) {
  res.render("home", { name: fname });
  console.log("server is up and running");
});
app.get("/about", function (req, res) {
  res.render("about");

});
app.get("/exercise", function (req, res) {
  res.render("exercise");
});

app.get("/bicep", function (req, res) {
  var name = "./js/bicep.js"
  res.render("exercise_home", { p1: name });
});
app.get("/squat", function (req, res) {
  var name = "./js/squat.js"
  res.render("exercise_home", { p1: name });
});
app.get("/sumosquat", function (req, res) {
  var name = "./js/sumosquat.js"
  res.render("exercise_home", { p1: name });
});
app.get("/exer_main", function (req, res) {
  res.render("exer_main");
});

app.get("/pushup", function (req, res) {
  var name = "./js/pushup.js"
  res.render("exercise_home", { p1: name });
});

app.get("/squatblog", function (req, res) {
  res.render("sqautblog");
});
app.get("/sumosquatblog", function (req, res) {
  res.render("sumosquatblog");
});
app.get("/bicepblog", function (req, res) {
  res.render("bicepblog");
});
app.get("/pushupblog", function (req, res) {
  res.render("pushupblog");
});
app.get("/touch_game", function (req, res) {
  var game_name = "./js/game.js";
  res.render("touch_game",{p1: game_name});
});
app.get("/touch_game_hand", function (req, res) {
  var game_name = "./js/game_hand.js";
  res.render("touch_game",{p1: game_name});
});

/** Blog Posts */


app.get("/diet", function (req, res) {
  res.render("diet");
});

app.get("/mentalh", function (req, res) {
  res.render("mentalhealth");
});

app.get("/sleep", function (req, res) {
  res.render("sleep");
});

app.get("/exer", function (req, res) {
  res.render("exer");
});


/** yoga pose */
app.get("/yoga", function (req, res) {
  res.render("yoga");
});


/** HPE */


var MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://admin-niharika:test123@cluster0.0f7ty.mongodb.net/hpeDB";
const client = new MongoClient(uri);


app.get("/manual",function(req,res){
  res.render("manual");
});

client.connect((err) => {
    const pages = client
      .db("hpeDB")
      .collection("pages");
    console.log("database connected")

    app.post("/manual1", (req, res) => {
      var bp = req.body.id;
      console.log(bp);
      if(bp!=' '){
      pages.findOne({key: bp}).then(function(result) {
      
    // console.log(result["key"]);
    // console.log(result["value"]["exercise1"]["name"]);
    // console.log(result["value"]["exercise1"]["description"]);
    // console.log(result["value"]["exercise1"]["steps"].split("|"));
    var bp_name = result["key"];
    var ex_name1 = result["value"]["exercise1"]["name"];
    var descrip1 =result["value"]["exercise1"]["description"];
    var steps1= result["value"]["exercise1"]["steps"].split("|");
    var gif1a = result["value"]["exercise1"]["gif1"];
    var gif1b = result["value"]["exercise1"]["gif2"];
    var ex_name2 = result["value"]["exercise2"]["name"];
    var descrip2 =result["value"]["exercise2"]["description"];
    var steps2= result["value"]["exercise2"]["steps"].split("|");
    var gif2a = result["value"]["exercise2"]["gif1"];
    var gif2b = result["value"]["exercise2"]["gif2"];
    var ex_name3 = result["value"]["exercise3"]["name"];
    var descrip3 =result["value"]["exercise3"]["description"];
    var steps3= result["value"]["exercise3"]["steps"].split("|");
    var gif3a = result["value"]["exercise3"]["gif1"];
    var gif3b = result["value"]["exercise3"]["gif2"];
    // console.log(gif1a);
     res.render('bp_ex',  {p1: bp_name,p2:ex_name1,p3:descrip1,p4:steps1,p5:ex_name2,p6:descrip2,p7:steps2,p8:ex_name3,p9:descrip3,p10:steps3,p11:gif1a,p12:gif1b,p13:gif2a,p14:gif2b,p15:gif3a,p16:gif3b});
    
       });
      // res.sendFile("./views/bp_ex.html", {name1: ex,name2 :desc,name3:steps}); 
       
    
    }//console.log(err);
    //client.close();
        
    });
   
    
});





/** yoga pose */
app.get("/yoga",function(req,res){
  res.render("yoga");
});




















/** HPE */













app.post("/contact", function (req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.emailadd;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us4.api.mailchimp.com/3.0/lists/27e2e75606";

  const options = {
    method: "POST",
    auth: "niharikad:2a63c529a685cbf749de038901bf8304-us4"
  }


  const request = https.request(url, options, function (response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});