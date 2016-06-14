const {define, spirit, routes, response} = require("../index")

const http = require("http")
const passport = require("passport")

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, { id: "test-user" });
});

const login = () => {
  passport.authenticate("local", {
    failureRedirect: "/login"
  }, (req, res) => {
    //res.redirect("/")
  })
}

const app = define([
  require('cookie-parser')(),
  require('body-parser').urlencoded({ extended: true }),
  require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }),
  passport.initialize(),
  passport.session(),
  routes.get("/", [], login)
])

const server = http.createServer(spirit([routes.route(app)]))
server.listen(3000)
