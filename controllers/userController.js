const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
    res.render("user/signup.ejs");
    
}

module.exports.signup = async (req, res) => {

    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }

            req.flash("Success", "welcome to wanderlust");
            res.redirect("/listings")
        });


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

}

module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("Success", "Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"

    if (redirectUrl.includes("/reviews/") &&
        redirectUrl.includes("_method=DELETE")) {
        const match = redirectUrl.match(/^\/listings\/([^/]+)/);

        redirectUrl = match
            ? `/listings/${match[1]}`
            : "/listings";
    }

    delete req.session.redirectUrl;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("Success", "You are logged out now!");
        res.redirect("/listings");
    });
}