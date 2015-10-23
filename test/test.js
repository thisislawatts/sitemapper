'use strict';

/**
 *
 *  TODO: Run local server for files
 * 
 */

var localProtocal = 'http';
var localHost = 'localhost';
var localPort = '8000';

var assert = require('chai').assert;
var siteMapper = require('../index.js');

describe('SiteMapper', function() {

	var s;

	before(function (done) {
		s = siteMapper( localProtocal + '://' + localHost +':' + localPort + '/sitemap.xml');
		s.fetch(done);
	});

	describe('#instance', function() {
		it('should throw an error if no URL is supplied', function() {
			assert.throw(siteMapper, /url is required/ );
		});
	});

	describe('#fetch', function() {
		it('fetch preloads object from url', function() {
			assert.isFunction(s.fetch);
		});
	});

	describe('#fetchUrls', function() {
		it('returns all Urls from a sitemap', function() {
			assert.isFunction(s.fetchUrls);
			assert.isArray(s.fetchUrls(), 'should return an array');
			assert.equal(s.fetchUrls().length, 2);
			assert.equal(s.fetchUrls()[0],'http://example.com');
		});
	});
});

describe('SiteMapper.helpers', function() {
	var s;
	before(function() {
		s = siteMapper(localProtocal + '://' + localHost +':' + localPort + '/indexOfSitemaps.xml');
	});

	describe('#getUrlsFromUrlset', function() {
		it('should return all urls from a urlset', function() {
			var urlset = {
				url : [{
					loc : ['http://example.com']
				}]
			};

			assert.isFunction(s.fetchUrlsFromUrlset);
			assert.isArray(s.fetchUrlsFromUrlset(urlset));
		});
	});
});

describe('SiteMapper.crawling', function() {
	var s;
	this.timeout(10000);

	before(function (done) {
		s = siteMapper( localProtocal + '://' + localHost +':' + localPort + '/indexOfSitemaps.xml');
		s.fetch(done);
	});

	describe('#navigateSitemapIndexes', function() {
		it('should follow links within a sitemap to other sitemaps', function() {

			assert.equal(s.fetchUrls().length, 4);
			assert.equal(s.fetchUrls()[0], 'http://example.com');
		});
	});
});