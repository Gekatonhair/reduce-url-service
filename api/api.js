const express = require("express");
const request = require('request-promise');
const dao = require('../dao/dao');//db module
const api = express.Router();


//const router = require('../router/router');//db module

api.post('/login', function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password) {
        req.session.authorized = false;
        res.sendStatus(400);//bad request
    } else {
        dao.checkUser(login, password)
            .then(() => {
                req.session.authorized = true;
                res.sendFile('main.html', {root: './public'});

            })
            .catch((error) => {
                res.status(401).end();
            });
    }
});

api.post('/register', function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password) {
        req.session.authorized = false;
        res.sendStatus(400);//bad request
    } else {
        dao.addUser(login, password)
            .then(() => {
                req.session.authorized = true;
                res.sendFile('main.html', {root: './public'});
                //res.status(200).end();
            })
            .catch(() => {
                res.status(401).end();
            });
    }
});

//reduce big url and insert pair short-big urls to db
api.post('/reduceUrl', function (req, res) {
    if (req.session.authorized) {
        let {bigUrl} = req.body;
        let {wantedUrl} = req.body;

        request(bigUrl)//check request url
            .then(async function (htmlString) {//all good
                console.log('OK, url online');
                shortUrl = await dao.reduceUrl(wantedUrl, bigUrl);
                res.status(200).json(shortUrl);
            })
            .catch(function (error) {//url not found in web
                if(error.name == 'RequestError' || error.statusCode == 404){
                    error.code = 404;
                    error.message = 'RequestError';
                }else{//others errors
                    error.code = 400;
                }
                res.status(error.code).send(error.message);
            });
    } else {
        res.redirect('/');
    }
});

module.exports = api;

