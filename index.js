'use strict';


var request = require('sync-request');
var parseXml = require('xml2js').parseString;

// Config

var reqOptions = {
	'headers' : {
		'user-agent' : 'example-user-agent'
	}
};

module.exports = function (url, opts) {

	var _self = {};

	if (typeof url !== 'string') {
		throw new TypeError('url is required.');
	}

	_self.url = url;

	opts = opts || {};

	_self.getUrlsFromUrlset = function(urlset) {
		var arr = [];

		urlset.url.forEach(function (item) {
			arr.push(item.loc.pop());
		});

		return arr;
	};

	return {
		fetchUrlsFromUrlset: _self.getUrlsFromUrlset,
		fetch: function(cb) {
			var res = request('GET', _self.url, reqOptions );

			parseXml(res.getBody(), function(err,res) {
				var urls = [];

				if ( res.urlset ) {
					urls = _self.getUrlsFromUrlset(res.urlset);
				} else if (res.sitemapindex) {

					var sitemaps = [];
					res.sitemapindex.sitemap.forEach(function(item) {
						sitemaps.push(item.loc.pop());
					});

					sitemaps.forEach(function(url) {
						var r = request('GET', url, reqOptions );

						parseXml(r.getBody(), function(err, res) {
							urls = urls.concat(_self.getUrlsFromUrlset(res.urlset));
						});
					});
				}

				_self.urls = urls;

				if (cb) {
					cb();
				}
			});
		},
		fetchUrls : function() {
			return _self.urls;
		}
	};
};
