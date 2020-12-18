const express = require("express");
const handle = require('handlebars');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require("mongoose");
const path = require("path");
const constants = require('./util/constants');
const viewHelpers = require('./util/view_helpers');

// const routes = require("./routes/api");
const routes = require('./routes/web');
const apiRoutes = require('./routes/api');

const prodDB = "mongodb+srv://admin:admin237@affirmedcluster.346yk.mongodb.net/affirmedme?retryWrites=true&w=majority";
const localDB = "mongodb://127.0.0.1:27017/affirmedme";

mongoose
  .connect(prodDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error(error));

const app = express();

app.use(cookieParser(constants.SESSION_SECRET));
app.use(session({
    key: 'user_sid',
    secret: constants.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { expires: new Date(Date.now() + (3600000 * 2)) }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// View engine config
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials'),
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handle),
    helpers: {
        inc: viewHelpers.inc,
        sectr: viewHelpers.parseSection,
        if_eq: function (a, b, opts) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
    }
}));


// Serve static files
app.use(express.static('public'));
app.use(express.static('content'));

// Check if user cookie exists while there's no user in session
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user)
      res.clearCookie('user_sid');

  next();
});

// Load routes
app.use(routes);
app.use('/api', apiRoutes);


// Errors pages
app.use((req, res) => {
  res.status(404);
  res.render('errors/404', { layout: false });
});

module.exports = app;
