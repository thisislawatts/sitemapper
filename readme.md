# Sitemap

## Install

```
$ npm install --save sitemap
```

## Usage

```js
var sitemap = require('sitemap');

sitemap('http://example.com/sitemap.xml');
sitemap.fetch();
sitemap.fetchUrls();
//=> ['http://example.com/', 'http://example.com/a']
```


## API

### sitemap(url)

#### url

Type: `string`

## License

MIT © [thisislawatts](http://bcmh.build)
