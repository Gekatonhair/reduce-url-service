//modele router -
const app = require("../app");
const express = require("express");
const router = express.Router();
const dao = require('../dao/dao');//db module

router.get('/', function (req, res) {
    const sid = req.cookies['sid'];

    /*if (sid) {
        req.sessionStore.get(sid, function (err, session) {
            if (err || !session) {
                res.redirect('login');
                return;
            } else if(session.authorize){

            } else {
                res.redirect('login');
            }
        });
    } else {
        res.redirect('login');
    }*/
    if (req.session.authorized) {
        res.sendFile('main.html', {root: './public'});
    } else {
        res.redirect('login');
    }
});


router.get('/login', function (req, res) {
    res.sendFile('login.html', {root: './public'});
});

router.get('/register', function (req, res) {
    res.sendFile('register.html', {root: './public'});
});

router.get('/logout', function (req, res) {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        res.status(405).send('Session error');
    }
});

//redirection from short url to big and increase short url visit ** здесь должен быть другой url?
router.get("/:url", function (req, res) {
    let shortUrl = req.params.url.substring(1);

    dao.getBigUrl(shortUrl)
        .then((bigUrl) => {
            res.redirect(301, bigUrl);
        })
        .catch((err) => {
            //console.log('error' + err);
            res.sendStatus(404);
        });
});

module.exports = router;