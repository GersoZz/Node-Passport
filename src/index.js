const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//Initializations
const app = express();
require("./database");
require("./passport/local-auth");

//settings
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

app.set("port", process.env.PORT || 3000);

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));//para recibir info de formularios
app.use(
  session({
    secret: "mysecretsession", //tambien podria ir en keys.js
    resave: false,
    saveUninitialized: false, // para decirle que no necesitamos una inicializacion previa
  })
);
app.use(flash());//despues de session

app.use(passport.initialize());
app.use(passport.session()); //tenemos que declarar esta session

//creo este middleware
app.use((req, res, next) => {
  app.locals.signupMessage = req.flash("signupMessage");
  app.locals.signinMessage = req.flash("signinMessage");
  app.locals.user=req.user;//P! esto es de passport
  //console.log('user: ',app.locals.user);
  next();
});

//Routes
app.use("/", require("./routes/index"));

//starting the server
app.listen(app.get("port"), () => {
  console.log("Server on Port", app.get("port"));
});
