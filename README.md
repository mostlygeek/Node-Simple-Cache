[![build status](https://secure.travis-ci.org/mostlygeek/Node-Simple-Cache.png)](http://travis-ci.org/mostlygeek/Node-Simple-Cache)

# About

A *really* simple cache to disk library. It will either return data from the disk cache file or fetch it from the source. 

# Install

    > npm install Simple-Cache

# Usage Examples

# Basic Example
    /**
     * Like just run this. It should be self explanitory 
     * how it works. 
     */
    var cache = require('Simple-Cache').SimpleCache("/tmp", console.log);
    
    /**
     *  cache.get returns a promise, cause tons of callback chains
     *  suck. 
     *  
     *  Usage: get(string key, cacheMissFn) { .... }
     */ 
    var promise = cache.get('my testing data', function(callback) {
        // some async operation... 
        callback(results);    
    });

## Multiple Callback Handlers on the Promise

    promise.fulfilled(function(results) {
       console.log("Callback 1: " + results);
    });
    
    promise.fulfilled(function(results) {
       console.log("Callback 2: " + results);
    });

## Fluent Interfaces

    promise.fulfilled(function(results) {
        console.log("Fluent interface 1");
    }).fulfilled(function(results) {
        console.log("Fluent interface 2");
    }).fulfilled(function(results) {
        console.log("Fluent interface 3. Ok we get it");
    });

# How To Use It In Real Life

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
