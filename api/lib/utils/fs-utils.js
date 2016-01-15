/* global Buffer */
ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};

ConceptMate.FSUtils = (function () {
  
  /**
   * 
   */
  this.getBuffer = function (doc, callback) {

    var buffer = new Buffer(0);
    // callback has the form function (err, res) {}
    var readStream = doc.createReadStream();
    
    readStream.on('data', function (chunk) {
      buffer = Buffer.concat([buffer, chunk]);
    });
    readStream.on('error', function (err) {
      callback(err, null);
    });
    readStream.on('end', function () {
      callback(null, buffer);
    });
  };

  return this;
}).call({});