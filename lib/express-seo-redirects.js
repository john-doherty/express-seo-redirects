'use strict';

var path = require('path');
var loadJson = require('shush'); // allows us to load JSON files that contain comments

/**
 * Returns express middleware to intercept and redirect requests
 * @param {string} pathToRedirects - relative path to redirects.json file
 * @param {boolean} strict - match on path and querystring (default false)
 * @returns {function} Express middleware
 */
module.exports = function(pathToRedirects, strict) {

    if (!pathToRedirects || pathToRedirects === '') throw new Error('Invalid pathToRedirects');

    // load redirects array (can contain JSON comments)
    var redirects = loadJson(path.resolve(pathToRedirects));

    // return middleware to intercept all requests
    return function(req, res, next) {

        var requestedUrl = (strict === true) ? req.url : req.url.split('?')[0];

        // attempt to find a redirect
        var redirect = arrayWhere(Array.isArray(redirects) ? redirects : [], 'from', requestedUrl, true);

        // if we have a destination
        if (redirect && redirect.to && redirect.to !== '') {
            // preform the redirect
            res.redirect(redirect.status || 302, redirect.to);
        }
        else {
            // otherwise, carry on
            next()
        }
    }
}

/**
 * Returns an object/array from an array where its property equals value.
 * @param {Array} src - array to search
 * @param {string} property - property to check
 * @param {object} value - value to test
 * @param {bool} firstOnly - only returns first value if true
 * @returns {array|object} returns an array of matches, or single item if @firstOnly param set
 */
function arrayWhere(src, property, value, firstOnly) {
    var res = [];
    src = src || [];
    for (var i = 0, l = src.length; i < l; i++) {
        if (src[i][property] === value) {
            if (firstOnly) {
                return src[i];
            }
            res.push(src[i]);
        }
    }
    return (firstOnly) ? null : res;
}