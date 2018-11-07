/** Colormap generator.
 *
 * Example:
 *
 *   define(["./colormap"], function (colormap) {
 *     var randomColor = colormap.create("random", { size: 16 });
 *     var grayColor = colormap.create("gray", { size: 16 });
 *     var hsvColor = colormap.create("hsv", { size: 256 });
 *     // ...
 *   });
 *
 * Copyright 2015  Kota Yamaguchi
 */
 // Modified by: Reem K. Al-Halimi, March/2017

 // Create a list of colors so there is one color per label.
define(function() {
  var registry = {
    random: function (options) {
      var colormap = [],
            offset = options.offset || 0;
      for (var i = 0; i < options.size; ++i)
        colormap.push([Math.floor(256 * Math.random()),
                       Math.floor(256 * Math.random()),
                       Math.floor(256 * Math.random())]);
      return colormap;
    },
    gray: function (options) {
      var colormap = [],
            offset = options.offset || 0;
      for (var i = offset; i < options.size; ++i) {
        var intensity = Math.round(255 * i / options.size);
        colormap.push([intensity, intensity, intensity]);
      }
      return colormap;
    },
    hsv: function (options) {
      var colormap = [],
          offset = options.offset || 0;
          saturation = (options.saturation === undefined) ?
              1 : options.saturation;
      for (var i = 0; i < options.size; ++i){
        colormap.push(hsv2rgb((i+offset)*1.0 / (options.size+offset), saturation, 1));
      }
      return colormap;
    },
    hhsv: function (options) {
      var colormap = [],
          depth = options.depth || 2,
          saturationBlocks = [],
          i;
      for (i = 0; i < depth; ++i)
        saturationBlocks[i] = 0;
      for (i = 0; i < options.size; ++i)
        saturationBlocks[Math.floor(depth * i / options.size)] += 1;
      for (i = 0; i < depth; ++i) {
        colormap = colormap.concat(registry.hsv({
          size: saturationBlocks[i],
          saturation: 1 - (i / depth)
        }));
      }
      return colormap;
    },
    single: function (options) {
      var colormap = [];
      for (var i = 0; i < options.size; ++i) {
        if (i === options.index)
          colormap.push(options.foreground || [255, 0, 0]);
        else
          colormap.push(options.background || [255, 255, 255]);
      }
      return colormap;
    }
  };

  /** Compute RGB value from HSV.
   */
  function hsv2rgb(h, s, v) {
    var i = Math.floor(h * 6),
        f = h * 6 - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        r, g, b;
    switch(i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return [r, g, b].map(function (x) { return Math.round(x * 255 / (Math.floor(Math.random() * 10) + 1)) });
  }

  function create(name, options) {
    if (typeof name === "undefined") name = "random";
    if (typeof options === "undefined") options = {};
    options.size = options.size || 0;
    return registry[name](options);
  }

  function foundInColormap(currColormap, newColor){
    var i=0, found = false;
    while (!(found) && (i< currColormap.length)){
      found = (currColormap[i] == newColor[0]) && (currColormap[i+1] == newColor[1]) && (currColormap[i+2] == newColor[2]);
      i = i+3;
    }
    return found;
  }

  function addNewColor(currColormap, name){
      var i=2,
          newColor = create(name, {  // Creates a list of RGB colors (uses hsv2rgb)
                   size: 1, offset: currColormap.length+1
                   });
      while (foundInColormap(currColormap, newColor)){
          newColor = create(name, {  // Creates a list of RGB colors (uses hsv2rgb)
                     size: 1, offset: currColormap.length+i
                     });
        i++;
      }
      return newColor;
  }

  function register(name, callback) {
    register[name] = callback;
  }

  return {
    create: create,
    addNewColor: addNewColor,
    foundInColormap: foundInColormap,
    register: register
  };
});
