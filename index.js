'use strict';

const request = require('sync-request');
const parseXml = require('xml2js').parseString;

Sitemapper = (url, opts) => {

	var _self = {};

	_self.reqOptions = {
		'headers' : {
			'user-agent' : 'github.com/bcmh/sitemapper'
		}
	};

	if (typeof url !== 'string') {
		throw new TypeError('url is required.');
	}

	_self.url = url;

	opts = opts || {};

	_self.getUrlsFromUrlset = (urlset) => {
		var arr = [];

		urlset.url.forEach(function (item) {
			arr.push(item.loc.pop());
		});

		return arr;
	};

	return {
		fetchUrlsFromUrlset : _self.getUrlsFromUrlset,
		fetch: (cb) => {
			var res = request('GET', _self.url, _self.reqOptions );

			parseXml(res.getBody(), (err,res) => {
				var urls = [];

				if ( res.urlset ) {
					urls = _self.getUrlsFromUrlset(res.urlset);
				} else if (res.sitemapindex) {

					var sitemaps = [];
					res.sitemapindex.sitemap.forEach(function(item) {
						sitemaps.push(item.loc.pop());
					});

					sitemaps.forEach(url => {
						var r = request('GET', url, _self.reqOptions );

						parseXml(r.getBody(), (err, res) => {
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
		fetchUrls : () => {
			return _self.urls;
		}
	};
}

module.exports = Sitemapper;