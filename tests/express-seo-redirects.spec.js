'use strict';

var path = require('path');
var redirects = require('..');
var request = require('./helpers/request');

var FIXTURE = path.join(__dirname, 'fixtures', 'redirects.json');

describe('express-seo-redirects', function() {

    it('should throw without a path to the redirects file', function() {
        expect(function() { redirects(); }).toThrowError('Invalid pathToRedirects');
        expect(function() { redirects(''); }).toThrowError('Invalid pathToRedirects');
    });

    it('should throw if the redirects file does not exist', function() {
        expect(function() { redirects(path.join(__dirname, 'fixtures', 'missing.json')); }).toThrow();
    });

    it('should redirect a matching path with its status', async function() {
        expect(await request(redirects(FIXTURE), '/old')).toEqual({ next: false, status: 301, to: '/new' });
    });

    it('should default to a 302 when no status is given', async function() {
        expect(await request(redirects(FIXTURE), '/temporary')).toEqual({ next: false, status: 302, to: '/elsewhere' });
    });

    it('should use the first matching redirect', async function() {
        expect((await request(redirects(FIXTURE), '/old')).to).toBe('/new');
    });

    it('should ignore the querystring', async function() {
        expect((await request(redirects(FIXTURE), '/old?utm_source=x')).to).toBe('/new');
    });

    it('should not match a from value that contains a querystring', async function() {
        expect((await request(redirects(FIXTURE), '/search?q=old')).next).toBe(true);
    });

    it('should call next when there is no matching redirect', async function() {
        expect(await request(redirects(FIXTURE), '/unknown')).toEqual({ next: true });
    });

    it('should call next when the destination is empty or missing', async function() {
        expect(await request(redirects(FIXTURE), '/empty')).toEqual({ next: true });
        expect(await request(redirects(FIXTURE), '/no-destination')).toEqual({ next: true });
    });

    it('should match the path case sensitively', async function() {
        expect((await request(redirects(FIXTURE), '/OLD')).next).toBe(true);
    });

    it('should match the trailing slash exactly', async function() {
        expect((await request(redirects(FIXTURE), '/old/')).next).toBe(true);
        expect((await request(redirects(FIXTURE), '/legacy')).next).toBe(true);
        expect((await request(redirects(FIXTURE), '/legacy/')).to).toBe('/modern');
    });
});
