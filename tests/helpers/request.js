'use strict';

var http = require('http');
var express = require('express');

/**
 * Starts an express app using the middleware, requests a url over http and reports what happened.
 * Any request the middleware passes on reaches a final route that responds 200, so we can tell next() was called.
 * Uses http.get rather than fetch so the tests run on the Node version in .nvmrc.
 * @param {function} middleware - middleware returned by redirects()
 * @param {string} url - relative url to request
 * @returns {Promise<object>} { next: false, status, to } when it redirected, or { next: true } when it passed the request on
 */
module.exports = function(middleware, url) {
    var app = express();

    app.use(middleware);
    app.use(function(req, res) {
        res.status(200).send('next');
    });

    return new Promise(function(resolve, reject) {
        var server = app.listen(0, '127.0.0.1', function() {
            http.get({ host: '127.0.0.1', port: server.address().port, path: url }, function(response) {
                response.resume();
                server.close();

                if (response.statusCode === 200) {
                    resolve({ next: true });
                }
                else {
                    resolve({ next: false, status: response.statusCode, to: response.headers.location });
                }
            }).on('error', function(err) {
                server.close();
                reject(err);
            });
        });
    });
};
