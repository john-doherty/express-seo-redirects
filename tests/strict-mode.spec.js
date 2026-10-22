'use strict';

var path = require('path');
var redirects = require('..');
var request = require('./helpers/request');

var FIXTURE = path.join(__dirname, 'fixtures', 'redirects.json');

describe('strict mode', function() {

    it('should match on path and querystring', async function() {
        expect(await request(redirects(FIXTURE, { strict: true }), '/search?q=old')).toEqual({ next: false, status: 301, to: '/search?q=new' });
    });

    it('should not match when the querystring differs', async function() {
        expect((await request(redirects(FIXTURE, { strict: true }), '/search?q=other')).next).toBe(true);
        expect((await request(redirects(FIXTURE, { strict: true }), '/old?utm_source=x')).next).toBe(true);
    });

    it('should still match a path without a querystring', async function() {
        expect((await request(redirects(FIXTURE, { strict: true }), '/old')).to).toBe('/new');
    });

    it('should be enabled by passing true as the second param', async function() {
        var middleware = redirects(FIXTURE, true);

        expect((await request(middleware, '/search?q=old')).to).toBe('/search?q=new');
        expect((await request(middleware, '/old?utm_source=x')).next).toBe(true);
    });
});
