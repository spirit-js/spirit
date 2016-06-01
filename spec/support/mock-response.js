/*
 * Helper for setting up a mock response object
 */

module.exports = {
  _map: {},
  writeHead(n, h) {
    this._map.status = n
    this._map.headers = h
  },
  write(n) {
    this._map.body = n
  },
  end() {}
}

