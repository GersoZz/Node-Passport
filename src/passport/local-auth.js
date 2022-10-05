const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//serializar y deserealizar: 

//passport almacenando la id en una cookie
passport.serializeUser((user, done) => {
  //esto se ejecuta cuando ya hemos ejecutado done()// o sea cuando ya tenemos un usuario guardado 
  
  //console.log('serializando')
  //req.session.passport.user
  done(null, user.id); //guarda el id
});

//pasport va buscar el nuevo usuario a traves del id que esta guardado en la cookie (en el navegador)
passport.deserializeUser(async (id, done) => {
  //console.log('desserializando')
  const user = await User.findById(id);
  done(null, user);
});
//deserializa cada vez que refresco la pagina

//----

//nombramos al metodo de autenticacion, y establecemos la estrategia
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });//asigno el documento
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "The Email is already taken.")
        );
      } else {
        const newUser = new User();//P! crea un documento (?)
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser); //null pq no hay error
      }
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });//asigno el documento
      if (!user) {
        return done(null, false, req.flash("signinMessage", "No User found."));
      }
      if (!user.comparePassword(password)) {
        return done(
          null,
          false,
          req.flash("signinMessage", "Incorrect Password")
        );
      }
      
      done(null, user); //null pq no hay error
    }
  )
);
