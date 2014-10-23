
var should = require("should");
var ObjectID = require("../");


describe("Constructing new ObjectIDs", function() {
  it("should construct with no arguments", function() {
    var o = new ObjectID();
    o.should.be.instanceof(ObjectID);
  });

});