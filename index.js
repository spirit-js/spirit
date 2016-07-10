var core = require("./lib/core/core")
var p_utils = require("./lib/core/promise_utils")

var node_adapter = require("./lib/http/node_adapter")
var response = require("./lib/http/response")
var response_map = require("./lib/http/response-class")


var node = response
node.adapter = node_adapter
node.Response = response_map.Response
node.is_Response = response_map.is_Response
node.utils = require("./lib/http/utils")

module.exports = {
  compose: core.compose,
  utils: p_utils,
  node: node
}
