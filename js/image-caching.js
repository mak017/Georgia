function ArtCache(maxCacheSize) {
    var art_cache_max_size = maxCacheSize;
    var art_cache = {};
    var art_cache_indexes = [];
    var max_width = 1440;
    var max_height = 872;

    this.encache = function(img, path) {
        try {
            var h = img.Height;
            var w = img.Width;
            var max_w = scaleForDisplay(max_width);
            var max_h = scaleForDisplay(max_height);
            if (w > max_w || h > max_h) {
                var scale_factor = w / max_w;
                if (scale_factor < h / max_h) {
                    scale_factor = h / max_h;
                }
                h = Math.min(h / scale_factor);
                w = Math.min(w / scale_factor);
            }
            art_cache[path] = img.Resize(w, h);
            img.Dispose();
            var pathIdx = art_cache_indexes.indexOf(path);
            if (pathIdx !== -1) {
                // remove from middle of cache and put on end
                art_cache_indexes.splice(pathIdx, 1);
            }
            art_cache_indexes.push(path);
            if (art_cache_indexes.length > art_cache_max_size) {
                var remove = art_cache_indexes.shift();
                debugLog('deleting cached img:', remove)
                disposeImg(art_cache[remove]);
                delete art_cache[remove];
            }
        } catch (e) {
            console.log('<Error: Image could not be properly parsed: ' + path + '>');
        }
        return art_cache[path] || img;
    }

    this.getImage = function(path) {
        if (art_cache[path]) {
            debugLog('cache hit: ' + path);
            return art_cache[path];
        }
        return null;
    }

    this.clear = function() {
        while (art_cache_indexes.length) {
            var remove = art_cache_indexes.shift();
            disposeImg(art_cache[remove]);
            delete art_cache[remove];
        }
    }
}
