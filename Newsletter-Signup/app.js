//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express(); // new instance of express

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Note "/" represents the home route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(firstName);
  console.log(lastName);
  console.log(email);

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

  // Turns Javascript Object into a Jon Object
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/6283466b08";
  const options = {
    method: "POST",
    auth: "chevano876:f2cd83a595566565ed60c65f1c7daa96-us17"
  };

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }

    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

// process.env.PORT is a dynamic port that heroku will define on the go
app.listen(process.env.PORT || 3000, function() {
  console.log("Tuning in on port 3000");
});

// API Key
// f2cd83a595566565ed60c65f1c7daa96-us17

// Audience ID (List ID)
// 6283466b08
