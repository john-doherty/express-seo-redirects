# express-seo-redirects

Simple config based 301/302 redirects for express.

## Install

```bash
npm install express-seo-redirects --save
```

## Usage

Add the middleware to your express application before all other routes.

```js
var express = require('express');
var app = express();
var redirects = require('express-seo-redirects');

// add middleware with relative path to redirect.json file
app.use(redirects('./redirects.json'));

// standard express route
app.get('/', function(req, res) {
    res.send('Hello world!');
});
```

Create a `redirects.json` file in the root of your project, with a list of redirects:

```json
[
    { "status": 301, "from": "/mobile-barcode-scanner", "to": "/docs/getting-started/mobile" },
    { "status": 301, "from": "/mobile-data-capture-platform", "to": "/" },
    { "status": 301, "from": "/plans", "to": "/pricing" },
    { "status": 301, "from": "/plans-new", "to": "/pricing" }
]
```

Each redirect can have 3 parameters:

Property | Type    | Required           | Description
-------- |:------- |:------------------:|:------------------------------------------
`from`   | string  | :heavy_check_mark: | Relative URL of incoming request
`to`     | string  | :heavy_check_mark: | Destination URL
`status` | integer |                    | HTTP response code _(302 if not provided)_

QueryStrings are ignored by default, to match on path and query string pass `app.use(redirects('./redirects.json', true));` as the second param to enable strict mode.

## Contributing

Feel free to contribute, either by [raising an issue](https://github.com/john-doherty/express-seo-redirects/issues) or:

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## History

For change-log, check [releases](https://github.com/john-doherty/express-seo-redirects/releases).

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](https://twitter.com/mrjohndoherty)
