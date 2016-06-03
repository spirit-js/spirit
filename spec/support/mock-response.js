/*
 * Helper for setting up a mock response object
 */

module.exports = {
  _map: {}, // this gets populated when response is written
  _done: () => {}, // this is called whenever _map is populated

  _reset() { // resets the above
    this._map = {}
    this._done = () => {}
  },

  writeHead(n, h) {
    this._map.status = n
    this._map.headers = h
  },
  write(n) {
    this._map.body = n
  },
  end() {
    this._done()
  }
}

