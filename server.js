/*
cd C:\Users\1\Desktop\read\learn JS\examples\umbrella
cd C:\Users\Mageridon\Desktop\umbrella
nodemon server.js
*/
//const http = require('http');
const express = require("express");
const session = require('express-session');
const requestpromise = require('request-promise');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PostgreSqlStore = require('connect-pg-simple')(session);

//my modules
const config = require('./config/config');//config file
const dao = require('./dao/dao');//db module

const app = express();
app.use('/public', express.static(__dirname + "/public"));//share folder 'public'
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    store: new PostgreSqlStore({
        conObject: config.db.postgres
    }),
    resave: true,
    saveUninitialized: true
}));

app.all('/', function (req, res) {
    if (req.session.authorized) {
        console.log(' main');
        res.sendFile(__dirname + '/public/main.html');

    } else {
        res.redirect('/login');
    }
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/api/login', function (req, res) {
    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password) {
        return res.sendStatus(400);
    } else {
        dao.checkUser(login, password)
            .then(() => {
                req.session.authorized = true;
                res.sendStatus(200);
            })
            .catch(() => {
                res.sendStatus(401);
            });
    }
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/api/register', function (req, res) {
   //добавление нового пользователя
    //dao.createUser().then redirecr('/');
});

app.get('/logout', function (req, res) {
    try {
        delete req.session.authorized;
        req.session.destroy();
        res.redirect('/');
    } catch (err) {
        res.status(405).send('Session error');
    }
});

//reduce big url and insert pair short-big urls to db
app.post('/api/reduceUrl', function (req, res) {
    //console.log("/authorized " + req.session.authorized);
    if (req.session.authorized) {
        let {bigUrl} = req.body;
        let {wantedUrl} = req.body;

        requestpromise(bigUrl)//check request url
            .then(async function (htmlString) {//all good
                console.log('OK, url online');
                shortUrl = await dao.reduceUrl(wantedUrl, bigUrl);
                res.status(200).send(shortUrl);
            })
            .catch(function (err) {//url not found in web
                //err.text = `url "<span>${bigUrl}</span>" is unavailable`;
                res.status(err.code).send(`url "<span>${bigUrl}</span>" is unavailable`);
            });
    } else {
        res.redirect('/');
    }
});

//redirection from short url to big and increase short url visit ** здесь должен быть другой url?
app.get("/api/goto/*", function (req, res) {
    console.log('go to');
    let shortUrl = req.url.substring(10);//get short url
    console.log(shortUrl);
    dao.getBigUrl(shortUrl)
        .then((bigUrl) => {
            res.writeHead(302, {
                'Location': bigUrl
            }).end();
        }).catch(() => {
        res.sendStatus(404);
    })
});

app.listen(config.server.port, () => {
    console.log("Server started successfully on port " + config.server.port);
});