/**
 * Like just run this. It should be self explanitory 
 * how it works. 
 */
var cache = require('./SimpleCache.js').SimpleCache("/tmp", console.log);

/**
 *  cache.get returns a promise, cause tons of callback chains
 *  suck. 
 *  
 *  Usage: get(string key, cacheMissFn) { .... }
 */ 
var promise = cache.get('my testing data', function(callback) {    
    /**
     * 
     * this method fetches the data if there is a 
     * cache miss
     * 
     */
    console.log("Fake Async... 1.5 until promise is fulfilled");    
    setTimeout(function() {
        callback('RESULTS COMPLETED');
    }, 1500);
    
});

/**
 * 
 * You can bind multiple callbacks for when the promise
 * is fulfilled
 * 
 */
promise.fulfilled(function(results) {
   console.log("Callback 1: " + results);
});

promise.fulfilled(function(results) {
   console.log("Callback 2: " + results);
});

/**
 * 
 * Fluent interfaces, sure why not?!
 * 
 */
promise.fulfilled(function(results) {
    console.log("Fluent interface 1");
}).fulfilled(function(results) {
    console.log("Fluent interface 2");
}).fulfilled(function(results) {
    console.log("Fluent interface 3. Ok we get it");
});

/**
 * 
 * You can bind callbacks even after the promise has 
 * been resolved. 
 * 
 */
setTimeout(function() {    
    promise.fulfilled(function(results) {
        console.log("Late callback 3: " + results);
    });
}, 1600);


/**
 * 
 * A Practical example. Cachine Web results.
 * 
 */
cache.get('omgz! the same file!', function(callback) {
    
    console.log("Fetching from https://raw.github.com/...");
    
    require('https').get({
        host : 'raw.github.com', 
        path : '/mostlygeek/Node-Simple-Cache/master/examples.js'
    }, function(res) {           
       var data = '';

       res.on('data', function(chunk) {
          data += chunk; 
       }).on('end', function() {
           callback(data);
       });
    });    
}).fulfilled(function(data) {
    console.log("Blam!, Got back " + data.length + " bytes");
});

