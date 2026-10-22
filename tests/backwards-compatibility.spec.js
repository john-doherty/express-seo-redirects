'use strict';

var path = require('path');
var redirects = require('..');
var redirectsV103 = require('./fixtures/express-seo-redirects-1.0.3');
var request = require('./helpers/request');

var FIXTURE = path.join(__dirname, 'fixtures', 'redirects.json');

// every second param a v1.0.3 user could have passed
var SECOND_PARAMS = [undefined, null, true, false, 'true', 1, 0, {}];

// urls covering matches, misses, querystrings, trailing slashes and case
var URLS = [
    '/',
    '/?a=1',
    '/old',
    '/old/',
    '/old//',
    '/old?utm_source=x',
    '/old/?utm_source=x',
    '/OLD',
    '/legacy',
    '/legacy/',
    '/temporary',
    '/search',
    '/search?q=old',
    '/search?q=other',
    '/search/?q=old',
    '/empty',
    '/no-destination',
    '/unknown',
    '/unknown/'
];

describe('backwards compatibility with v1.0.3', function() {

    it('should behave the same as v1.0.3 for every second param it accepted', async function() {
        for (var secondParam of SECOND_PARAMS) {
            var current = redirects(FIXTURE, secondParam);
            var previous = redirectsV103(FIXTURE, secondParam);

            for (var url of URLS) {
                expect(await request(current, url)).withContext('redirects(file, ' + JSON.stringify(secondParam) + ') ' + url).toEqual(await request(previous, url));
            }
        }
    });
});
