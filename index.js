const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
//the code imports express, which is a popular web framework for Node.js, body-parser, used to parse incoming request bodies, request, used for making HTTP requests to external APIs, and https, a built-in Node.js module for making secure HTTP requests.

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req,res)=> {
res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res)=>{

      // Extract data from the form submission
const firstName=req.body.fName;
const lastName=req.body.lName;
const email=req.body.email;

// Create a JavaScript object representing the data to be sent to Mailchimp

//javaScript object (data)  having one attribute (members) which is an array with just one element(0 index) which is a JS object and inside it there is one more JS object (merge_fields)
const data = {
    members : [
     {
        email_address : email,
        status : "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
     }
    ]
};

// Convert the JavaScript object to JSON
const jsonData = JSON.stringify(data);//This is what we are going to send to mailchimp

 // Set up options for the HTTPS request to Mailchimp API
const url = "https://us21.api.mailchimp.com/3.0/lists/a8f52f282a  ";
//In mailchimp, you could have multiple lists and you have to tell it which lists you want to subscribe the members into,so you have to specify the listId : a8f52f282a 

//js object
const options = {
    method : "POST",
   //method <string> A string specifying the HTTP request method. Default: 'GET'.It helps us to specify the type of request we want to make

    auth:"Fatima:5b4de27491e79a549e4d95f092170eab-us21"
    //auth <string> Basic authentication ('user:password') to compute an Authorization header
}


// https.get(url,()=>{})   ....> this only make get request when we want data from external source but 
//we want to post data to the external resource

//https://nodejs.org/api/http.html#httprequestoptions-callback   It is specidfied at this url that option is an object

// Make the HTTPS request to the Mailchimp API
const request = https.request(url,options,(response)=>{
    if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }

 //we are looking for the data that is send back by the mailchimp server

  // Listen for the response data from Mailchimp
 response.on("data",(data)=>{
    
     console.log(JSON.parse(data));
   
 });

});
 // Send the JSON data to Mailchimp
 request.write(jsonData);//pass the json data to the mailchimp server
 request.end();  //we are done with the request


});

app.post("/failure" , (req,res)=> {
res.redirect("/");
});




app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
//5b4de27491e79a549e4d95f092170eab-us21
//a8f52f282a     This will help mailchimp to identify the list that you want to put your subscribers to

// app.use(): This is an Express method that is used to mount middleware functions on the Express application. Middleware functions are functions that have access to the request and response objects and can perform actions before the request is handled by the route handler.

//middleware bodyParser.urlencoded() parses incoming requests with URL-encoded payloads. It makes sure that data sent from the client (browser) is correctly parsed and available in the req.body object.

// express.static(): This is a built-in middleware function in Express that serves static files such as images, CSS files, JavaScript files, and more to the client. It takes one argument, which is the root directory from which to serve the static files.

//When you use app.use(express.static("public"));, you are telling the Express application to use the express.static() middleware to serve static files from the "public" directory. It means that any files placed inside the "public" directory can be accessed directly by the client using their respective URLs.For example, if you have a file named "styles.css" inside the "public" directory, the client can access it using the URL "http://yourdomain.com/styles.css."

//The url variable contains the Mailchimp API endpoint URL for the mailing list where the user should be subscribed. The options variable includes the request method (POST) and the authentication information (API key provided as "username:password" format).
//an HTTPS request is created using https.request(), which sends the user data to the Mailchimp API. The callback function inside https.request() listens for the response data from Mailchimp.

//Once the request is set up, the JSON data is sent to the Mailchimp server using request.write(), and the request is finalized with request.end()
















//https://us21.admin.mailchimp.com/lists/members?id=14256#p:1-s:25-sa:last_update_time-so:false
//https://nodejs.org/api/http.html#httprequestoptions-callback
//https://mailchimp.com/developer/marketing/api/