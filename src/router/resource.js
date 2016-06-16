const serve_static = require("serve-static")

/*

 `req._named_route` is set by the spirit router middleware specifically for _special_ circumstances where a Express middleware needs routing information.

 It's needed since routing in spirit is different than in Express (technically & conceptually).

 Long story short, in spirit there should be a clear separation of middleware & handlers. In Express it's all grouped together. So this is a workaround to play nice with Express.

 Also the modification of `req.url` and `req.originalUrl` is unique to the way Express does things. And it is here since serve-static expects req.url to be modified.

 */


function resources(url_path="", opts) {
  let root
  if (!opts || !opts.root) {
    root = "public/"
  } else {
    root = opts.root
  }

  return function(req, res, next) {
    let p = ""
    if (req._named_route) {
      p = p + req._named_route
    }
    p = p + url_path

    // url match?
    if (req.url.indexOf(p) === 0) {
      req.originalUrl = req.url
      req.url = req.url.slice(p.length)
      serve_static(root, opts)(req, res, () => {
        // if serve-static "fails" and calls next
        // wrap the actual next instead so req.url can be reset
        req.url = req.originalUrl
        next()
      })
    } else {
      next()
    }
  }
}

module.exports = resources
