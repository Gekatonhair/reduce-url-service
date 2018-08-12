//"use strict";

const express = require("express");
const session = require('express-session');
const cronJob = require('cron').CronJob;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PostgreSqlStore = require('connect-pg-simple')(session);

//my modules
const config = require('./config/config');
const router = require('./router/router');
const dao = require('./dao/dao');
const api = require('./api/api');

const app = express();
app.use('/public', express.static(__dirname + "/public"));//share folder 'public'
app.use(bodyParser.urlencoded({
    extended: true
}));//app can parse form data
app.use(bodyParser.json());//app can parse json
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    store: new PostgreSqlStore({
        conObject: config.db.postgres
    }),
    resave: true,
    saveUninitialized: true
    //expires: true,
}));

//every day in 23:59 cronJob delete all old url (age > 15 day)
new cronJob('59 23 * * * *', function(){
    dao.deleteOldUrl();
}).start();

app.use("/", router);
app.use("/api", api);

module.exports = app;