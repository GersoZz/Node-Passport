const express = require("express");
const router = express.Router();

const passport = require("passport");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    passReqToCallback: true,
  })
);

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

//router.post("/signin", (req, res, next) => {});
router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    passReqToCallback: true,
  })
);

/* router.get('/logout',(req,res,next)=>{
  req.logout();
  res.redirect('/');
}) */

router.get("/logout", (req, res, next) => {
  //funcion de passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    //req.flash("success_msg", "You are logged out now");
    res.redirect("/");
    //req.session.user = null;
    //res.send("logout");
  });
});

//middleware sc
router.use((req, res, next) => {
  isAuthenticated(req, res, next);
  next();//
});

//con el next() de arriba el servidor trata de ejecutar la ruta luego del redirect 
//x a pesar de que no entra a profile y dashboard sale un error
//P! parece que solo se puede mandar una vez el res. //x eso cuando mando 1ro res.redirect() ya no funcionan los res.render()

//router.get("/profile",isAuthenticated, (req, res, next) => {
router.get("/profile", (req, res, next) => {
  // res.redirect("/");
  res.render("profile");
});

router.get("/dashboard", (req, res, next) => {
  res.render("dashboard");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
