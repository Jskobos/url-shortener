var request = require("request");
var base_url = "http://localhost:3000/"
var long_url = "http://www.baidu.com"

describe("URL shortener", function() {
  describe("/GET", function() {
    it("returns status code 200", function(done) {
      request.get(base_url + "new/" + long_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    it("returns the original url", function(done) {
      request.get(base_url + "new/" + long_url, function(error, response, body) {
        body = JSON.parse(body);
        expect(body['original_url']).toEqual(long_url);
        done();
      });
    });
    it("returns a shortened url", function(done) {
      request.get(base_url + "new/" + long_url, function(error, response, body) {
        body = JSON.parse(body);
        expect(body['short_url']).toBeDefined();
        done();
      });
    });
  });
});
