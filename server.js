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
mongoose.model("Otter", OtterSchema);

var Otter = mongoose.model("Otter");

// routes
app.get("/", function (req, res) {
    Otter.find({}, function (err, otters) {
        res.render("index", { otters: otters });
    });
});

app.get("/otters/new", function(req, res){
    res.render("new");
});
    // new user
app.post("/new", function(req, res){
    console.log("post data");
    var otter = new Otter({
        name: req.body.name,
        age: req.body.age,
        favorite_food: req.body.favorite_food
    });
    otter.save(function(err){
        if(err){
            console.log("oops! something went wrong", err);
            for (var key in err.errors) {
                req.flash('otters', err.errors[key].message);
            }
            res.redirect("index");
        } else {
            console.log("successfully added an otter!");
            res.redirect("/");
        }
    });
});
    //show a specific user
app.get("/otters/:id", function(req, res, err){
    var id = req.params.id;
    Otter.findById({_id:id}, function(err, otters){
        res.render("show", {otters:otters});
    });
});

    // update a user
app.get("/otters/:id/edit", function(req, res){
    var id = req.params.id;
        Otter.findById({_id: id }, function (err, otters) {
        res.render("edit", { otters: otters });
    });
});
    // update a user
app.post("/otters/:id", function(req, res, err){
    var id = req.params.id;
    Otter.findByIdAndUpdate({ _id: id }, function(err, otters){
        otter.name = req.body.name,
        otter.age = req.body.age,
        otter.favorite_food = req.body.favorite_food
    });
    otter.save(function(err){
        if(err){
            res.redirect("/", { errors: otter.errors });
            console.log("oops! something went wrong");
        } else {
            console.log("successfully updated an otter!");
            res.redirect("/");
        }
    });
});

    // delete a user
app.post("/otters/:id/delete", function(req, res, err){
        var id = req.params.id;
        Otter.findByIdAndRemove({_id:id}, function(err){
            if (err) {
                res.redirect("/otter/:id", { errors: otter.errors });
                console.log("oops! something went wrong");
            } else {
                console.log("successfully updated an otter!");
                res.redirect("/");
            } 
        });
    });

// port
app.listen(5000, function () {
    console.log("listening on port 5000");
});