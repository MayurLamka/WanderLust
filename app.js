if(process.env.NODE_ENV != "production"){
    require('dotenv').config();

}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path")
const methodoverride = require("method-override")
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");




const port = 8080;
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/reviews.js");
const userRouter = require("./Routes/user.js");
const User = require("./models/user.js")

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connection succesfull")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));





const store = MongoStore.create({
    mongoUrl: dbUrl,

    crypto: {
        secret: process.env.SECRET,
    },

    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in Mongo session store", err);
});


const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("/*splat", (req, res, next) => {

    next(new ExpressError(404, "Page not Found!"));
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;

    res.locals.currUser = req.user || null;

    res.status(status).render("error.ejs", { message });
});

app.listen(port, () => {
    console.log("Server is listing to port 8080")
})