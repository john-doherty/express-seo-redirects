'use strict';

var path = require('path');
var loadJson = require('shush'); // allows us to load JSON files that contain comments

/**
 * Returns express middleware to intercept and redirect requests
 * @param {string} pathToRedirects - relative path to redirects.json file
 * @param {boolean|object} options - true for strict mode, or an options object
 * @param {boolean} options.strict - match on path and querystring (default false)
 * @param {boolean} options.ignoreTrailingSlash - match /old/ and /old against the same redirect (default false)
 * @returns {function} Express middleware
 */
module.exports = function(pathToRedirects, options) {

    if (!pathToRedirects || pathToRedirects === '') throw new Error('Invalid pathToRedirects');

    // the second param used to be the strict flag, so keep accepting a boolean
    if (typeof options !== 'object' || options === null) {
        options = { strict: options === true };
    }

    var strict = options.strict === true;
    var ignoreTrailingSlash = options.ignoreTrailingSlash === true;

    // load redirects array (can contain JSON comments)
    var redirects = loadJson(path.resolve(pathToRedirects));

    // return middleware to intercept all requests
    return function(req, res, next) {

        var requestedUrl = (strict === true) ? req.url : req.url.split('?')[0];

        // attempt to find a redirect
        var redirect = findRedirect(Array.isArray(redirects) ? redirects : [], requestedUrl, ignoreTrailingSlash);

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
 * Returns the first redirect whose from value matches the requested url.
 * @param {Array} redirects - list of redirects
 * @param {string} requestedUrl - url to match (path, or path and querystring in strict mode)
 * @param {bool} ignoreTrailingSlash - remove a trailing slash from both sides before comparing
 * @returns {object} matching redirect, or null if there is none
 */
function findRedirect(redirects, requestedUrl, ignoreTrailingSlash) {
    var value = ignoreTrailingSlash ? removeTrailingSlash(requestedUrl) : requestedUrl;

    for (var i = 0, l = redirects.length; i < l; i++) {
        var from = redirects[i].from;

        if (ignoreTrailingSlash && typeof from === 'string') {
            from = removeTrailingSlash(from);
        }

        if (from === value) {
            return redirects[i];
        }
    }

    return null;
}

/**
 * Removes the trailing slash from the path part of a url, leaving the home page as /.
 * @param {string} url - relative url, optionally with a querystring
 * @returns {string} url without a trailing slash on its path
 */
function removeTrailingSlash(url) {
    var parts = url.split('?');
    parts[0] = parts[0].replace(/\/+$/, '') || '/';
    return parts.join('?');
}