const express = require('express');
const mongoose = require('./db/db');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const Product = require('./models/product');

const app = express();

var hbs = require('hbs');

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
        },
    })
);
app.use(flash());

app.set('view engine', 'hbs');

app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials/');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    if (req.session.user && req.session.user.role == 0)
        return res.redirect('/admin/product/list');
    else {
        return res.redirect('/home');
    }
})

const productRoute = require("./routes/product");
const storeRoute = require("./routes/store");
const cartRoute = require("./routes/cart");
const userRoute = require("./routes/user");
const checkoutRoute = require("./routes/checkout");
const orderRoute = require("./routes/order");

app.use("/", productRoute);
app.use("/", storeRoute);
app.use("/", cartRoute);
app.use("/", userRoute);
app.use("/", checkoutRoute);
app.use("/", orderRoute);

hbs.registerHelper('multiplication', function(a, b) {
    return a * b;
});

hbs.registerHelper('equals', (val1, val2) => {
    return val1 == val2;
});

hbs.registerHelper('isShow', (user) => {
    return !user || user.role == 1;
});

hbs.registerHelper('showCancelOrderButton', (status) => {
    return status == "Received" || status == "In progress";
});

hbs.registerHelper('setSelectedItem', (val1, val2) => {
    return (val1 == val2) ? 'selected' : '';
});

hbs.registerHelper('getStatus', function getStatus(status) {
    if (status == 0) {
        return "Received";
    } else if (status == 1) {
        return "In progress"
    } else if (status == 2) {
        return "Completed"
    } else if (status == 3) {
        return "Cancelled"
    } else if (status == 4) {
        return "Waiting to cancel order"
    } else {
        return "";
    }
});

hbs.registerHelper('showNewProduct', (date) => {
    var d1 = new Date(date);
    var d2 = new Date();
    return (d1.getFullYear() == d2.getFullYear()) && (d1.getMonth() == d2.getMonth()) && (d1.getDate() == d2.getDate());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT);
});