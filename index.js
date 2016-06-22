var core = require("./lib/core/core")
var p_utils = require("./lib/core/promise_utils")

var node_adapter = require("./lib/http/node_adapter")
var response = require("./lib/http/response")

module.exports = {
  core: core.main,
  utils: p_utils,

  node: {
    adapter: node_adapter.adapter,
    response: response
  }
}
