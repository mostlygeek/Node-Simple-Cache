var fs = require('fs');

exports.Cache = function(cacheDir, debug)
{
    var stats = fs.lstatSync(cacheDir); 
    if (!stats.isDirectory()) {
        throw cacheDir + " is not a directory";
    }
    
    debug = debug || function() {}; // empty function
    
    // return a brand new object..     
    return {
        _dir : cacheDir, 
        $debug : debug,
        
        get : function(key, fillFn) {
            var file = this.cacheName(key), 
                context = this;
            
            /** 
             * A *very* simple promise 
             */
            var promise = {                
                results : null,
                done : false,
                cbs : [],       // callbacks
                
                resolve : function(results)
                {
                    if (this.done) {
                        return; // a bit of safety :)
                    }
                    
                    var cb;
                    while(cb = this.cbs.shift()) {
                        cb.call(this, results);
                    }
                    
                    this.results = results;
                    this.done = true;

                }, 
                
                /**
                 * What to do when the promise has been fulfilled
                 */
                fulfilled : function(cb) 
                {                    
                    if (typeof(cb) !== "function") {
                        throw "callback is not a function";
                    }
                    
                    if (this.done) {
                        cb(this.results);
                    } else {
                        this.cbs.push(cb);
                    }
                    
                    return this;
                }                
            };
            
            fs.readFile(file, function(err, data) {
                if (err) {
                    /**
                     * Have the handler function resolve the 
                     * promise when it finishes what it needs to 
                     * do.
                     */
                    fillFn.call(context, function(results) {
                        context.write(key, results); 
                        promise.resolve(results);
                    });
                } else {
                    /**
                     * Resolve promise immediately with the 
                     * data from the cache. 
                     */
                    promise.resolve(JSON.parse(data));
                }
            });  
            
            return promise;
        },
        
        write: function(key, data)
        {
            var file = this.cacheName(key), 
                context = this;
                
            fs.writeFile(file, JSON.stringify(data), function(err) {
                if (err) {
                    context.$debug("Cache write error: " + err);
                }
            });            
        },
        
        
        cacheName : function(key) 
        {
            var shasum = require('crypto').createHash('sha1');
            shasum.update(key);
            return this._dir + '/' + shasum.digest('hex');
        }        
    };
}   