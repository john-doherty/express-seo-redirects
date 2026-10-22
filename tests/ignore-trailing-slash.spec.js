'use strict';

var path = require('path');
var redirects = require('..');
var request = require('./helpers/request');

var FIXTURE = path.join(__dirname, 'fixtures', 'redirects.json');

describe('ignoreTrailingSlash', function() {

    it('should match a request with a trailing slash against a from without one', async function() {
        expect(await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/old/')).toEqual({ next: false, status: 301, to: '/new' });
    });

    it('should match a request without a trailing slash against a from with one', async function() {
        expect((await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/legacy')).to).toBe('/modern');
    });

    it('should still match exact paths', async function() {
        var middleware = redirects(FIXTURE, { ignoreTrailingSlash: true });

        expect((await request(middleware, '/old')).to).toBe('/new');
        expect((await request(middleware, '/legacy/')).to).toBe('/modern');
    });

    it('should remove multiple trailing slashes', async function() {
        expect((await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/old//')).to).toBe('/new');
    });

    it('should ignore the querystring', async function() {
        expect((await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/old/?utm_source=x')).to).toBe('/new');
    });

    it('should keep the home page as /', async function() {
        expect((await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/')).to).toBe('/home');
    });

    it('should call next when there is no matching redirect', async function() {
        expect(await request(redirects(FIXTURE, { ignoreTrailingSlash: true }), '/unknown/')).toEqual({ next: true });
    });

    it('should work with strict mode', async function() {
        var middleware = redirects(FIXTURE, { strict: true, ignoreTrailingSlash: true });

        expect((await request(middleware, '/search/?q=old')).to).toBe('/search?q=new');
        expect((await request(middleware, '/old/?utm_source=x')).next).toBe(true);
    });
});
