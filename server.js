const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
var mongoose = require("mongoose");
var path = require("path");

// sessions
app.use(session({
    secret: "UnTiTlEd_(pOrTrAiT_Of_rOsS)_By_Felix_Gonzalez-Torres",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 }
}));

//app use
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// mongoose db
mongoose.connect("mongodb://localhost/mongoose_dashboard");

var OtterSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    age: { type: Number, required: true },
    favorite_food: { type:String, required:true, minlength:2}
});
mongoose.model("Otter", QuoteSchema);

var Quote = mongoose.model("Otter");

// routes
app.get("/", function (req, res) {
    res.render("index");
});

app.get("otter/new", function(req, res){
    res.render("new");
});

app.get("/otter/:id", function(req, res){
    Otter.find({}, function(err, otters){
        res.render("otters", {otters:otters});
    });
});

// port
app.listen(5000, function () {
    console.log("listening on port 5000");
});