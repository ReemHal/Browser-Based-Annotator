/** Misc utilities regarding HTTP request.
 */

 // Modified by: Reem K. Al-Halimi, March/2017

 // These are the functions that read the JSON file listing the labels and the input images and annotations
define(function () {
  // Get JSON by AJAX request.
  function requestJSON(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = xmlhttp.responseText;
        callback(JSON.parse(data));
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  // Parse query params.
  function getQueryParams(queryString) {
    var tokens,
        params = {},
        re = /[?&]?([^=]+)=([^&]*)/g;
    queryString = queryString || document.location.search;
    while (tokens = re.exec(queryString.split("+").join(" ")))
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    return params;
  }

  // Create a unique array.
  function unique() {
    var uniqueArray = [];
    for (var i = 0; i < arguments.length; ++i) {
      var array = arguments[i];
      for (var j = 0; j < array.length; ++j) {
        if (uniqueArray.indexOf(array[j]) < 0)
          uniqueArray.push(array[j]);
      }
    }
    return uniqueArray;
  }

  // Create query params from an object.
  // the annotated image list in the jason file can either be empty 
  // or not. If not then each input image must have a corresponding annotation image
  function makeQueryParams(params, updates) {
    params = params || {};
    updates = updates || {};
    var queryString = "?";
    var keys = unique(Object.keys(params), Object.keys(updates));
    for (var i = 0; i < keys.length; ++i) {
      var value = updates[keys[i]];
      //console.log("value"+value);
      if (value === null)
        continue;
      else if (typeof value === "undefined")
        value = params[keys[i]];
      queryString = queryString +
                    encodeURIComponent(keys[i]) + "=" +
                    encodeURIComponent(value) +
                    ((i < keys.length - 1) ? "&" : "");
    }
    return queryString;
  }

  return {
    requestJSON: requestJSON,
    getQueryParams: getQueryParams,
    makeQueryParams: makeQueryParams
  };
});
