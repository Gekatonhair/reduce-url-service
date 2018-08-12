const pgpromise = require('pg-promise')();
const crypto = require("crypto");
const config = require('../config/config');
const db = pgpromise(config.db.postgres);//database instance;
const checkWantedUrl = (wantedUrl) => (/^([a-z-\.])+$/).test(wantedUrl);

db.one('SELECT 1')
    .then(() => {
        console.log(`DB connect successful!`);
    })
    .catch(error => {
        console.log(error);
    });

exports.reduceUrl = (wantedUrl, bigUrl) => {
    return new Promise(function (resolve, reject) {
        if (wantedUrl != '') {//if user want some short url
            db.one('INSERT INTO urlData ("url", "shortUrl", "createDate") SELECT $1, $2, current_date where not exists (SELECT * FROM urlData WHERE "shortUrl" = $2) RETURNING *',
                [bigUrl, wantedUrl])
                .then((urlData) => {
                    console.log(`add new url if: ${urlData.shortUrl}`);
                    resolve(wantedUrl);
                })
                .catch(error => {
                    console.log(error);
                    if(error.code == 0){
                        error.message = `${wantedUrl}  is busy`;
                    }
                    reject(error);
                });
        } else {//wantedUrl = ''
            let shortUrl = crypto.randomBytes(4).toString('hex');

            db.one('INSERT INTO "urldata" ("url", "shortUrl", "createDate") VALUES ($1, $2, current_date) RETURNING "shortUrl"', [bigUrl, shortUrl])
                .then(urldata => {//go to page
                    console.log(`add new url else: ${urldata.shortUrl}`);
                    resolve(shortUrl);
                })
                .catch(error => {
                    error.message = 'Database error, can\'t insert data';
                    reject(error);
                });
        }//#else
    })//#return Promise
};

//increase short url visit
exports.getBigUrl = (shortUrl) => {
    return new Promise(function (resolve, reject) {
        db.one('UPDATE "urldata" SET "shortUrlUsageCount" = "shortUrlUsageCount"+1 WHERE "shortUrl" = $1 RETURNING "url"', shortUrl)
            .then((urldata) => {//go to page
                console.log(`Urldata = ${urldata.url}`)
                resolve(urldata.url);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
    });
}

exports.checkUser = function (login, password) {
    return new Promise(function (resolve, reject) {
        db.one('SELECT "login", "password" FROM users WHERE "login" = $1 AND "password" = $2', [login.toLowerCase(), hash(password)])
            .then(user => {
                console.log(`login: ${user.login}, password: ${user.password}`);//print user name;
                console.log('Check user ok');
                resolve(true);
            })
            .catch(error => {
                error.message = `User ${login} not found`
                console.log('Check user fail - not found')
                reject(error)
            });
    });
}

exports.addUser = function (login, password) {
    return new Promise(function (resolve, reject) {
        db.one('INSERT INTO users ("login", "password") SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM  users WHERE "login" = $1) RETURNING "login"', [login.toLowerCase(), hash(password)])
            .then(user => {
                console.log(user);
                console.log(`Add user ${user.login} ok`);
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                console.log(`Add user ${login} fail`);
                reject(error)
            });
    });
}

exports.deleteOldUrl = function () {
    return new Promise(function (resolve, reject) {
        db.one('DELETE FROM urldata WHERE date_part(\'day\', age(current_date, "createDate")) > 15')
            .then(() => {
                console.log('Delete old url');
                resolve(true);
            })
            .catch(error => {
                console.log('No delete url');
                reject(error)
            });
    });
}

function hash(text) {
    return crypto
        .createHash('sha1')
        .update(text)
        .digest('hex');
}