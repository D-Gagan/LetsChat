const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Middleware setup
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: '888153648277-6al662vpm8h771vtoiqnul5brhc68jg3.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://d-gagan.github.io/Chatting/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Save user information in the session
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.send('Login Page');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://d-gagan.github.io/Chatting/');
  }
);

app.get('/chat', ensureAuthenticated, (req, res) => {
  res.send(`Welcome to the chat, ${req.user.displayName}!`);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
