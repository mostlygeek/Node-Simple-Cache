var cache = require('./Cache.js').Cache("/tmp", console.log);

var promise = cache.get('my testing data', function(callback) {    
    /**
     * this method fetches the data for real if it doesn't
     * exist in the cache. 
     */
    console.log("Fake Async... 2 seconds to complete");    
    setTimeout(function() {
        callback('RESULTS COMPLETED');
    }, 2000);
    
});

promise.fulfilled(function(results) {
   console.log("Callback 1: " + results);
});

promise.fulfilled(function(results) {
   console.log("Callback 2: " + results);
});

