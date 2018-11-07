/** Pagination helper.
 *
 *  Example:
 *
 *    var pagination = new Pagination(100, params);
 *    document.body.appendChild(pagination.render());
 *
 * Copyright 2015  Kota Yamaguchi
 */

 // Modified by: Reem K. Al-Halimi, March 2017
 // Creates pages of indexed image lists. Each image can be clicked to be annotated.
// This is the main page for the application

define(["./util"],
function (util) {
  // This where the top of the page is created "Prev i Next" on the main application page
  function Pagination(count, params) {
    var i, anchor,
        page = parseInt(params.page || 0, 10),
        perPage = parseInt(params.per_page || 30, 10),
        neighbors = parseInt(params.page_neighbors || 2, 10),
        pages = Math.ceil(count / perPage),
        startIndex = Math.min(Math.max(page * perPage, 0), count),
        endIndex = Math.min(Math.max((page + 1) * perPage, 0), count);
    console.log("page, perPage, pages, startIndex, endIndex, count: "+page+" "+ perPage +" "+ pages +" "+startIndex +" "+ endIndex+ " " + count);
    this.begin = function () { return startIndex; };
    this.end = function () { return endIndex; };
    this.render = function (options) {
      options = options || {};
      var index = [];
      for (i = 0; i < pages; ++i) {
        if (i <=  ((page <= neighbors) ? 2 : 1) * neighbors ||
            (page - neighbors <= i && i <= page + neighbors) ||
            pages - ((page >= pages - neighbors - 1) ? 2 : 1) * neighbors <= i)
          index.push(i);
      }
      // Create the page
      var container = document.createElement(options.nodeType || "p");
      { // "Prev" link
        anchor = document.createElement("a");
        if (page > 0) // If this is not the very first image attach an href of the previous image to anchor
          anchor.href = util.makeQueryParams(params, { page: page - 1 });
        anchor.appendChild(document.createTextNode("Prev"));
        container.appendChild(anchor);
        container.appendChild(document.createTextNode(" "));
      }
      for (i = 0; i < index.length; ++i) {
        anchor = document.createElement("a");
        if (index[i] !== page) // show current page number
          anchor.href = util.makeQueryParams(params, { page: index[i] });
        anchor.appendChild(document.createTextNode(index[i]));
        container.appendChild(anchor);
        container.appendChild(document.createTextNode(" "));
        if (i < index.length - 1 && index[i] + 1 != index[i+1])
          container.appendChild(document.createTextNode("... "));
      }
      {
        anchor = document.createElement("a");
        if (page < pages - 1) // If this is not the last image, create an href to the next image
          anchor.href = util.makeQueryParams(params, { page: page + 1 });
        anchor.appendChild(document.createTextNode("Next"));
        container.appendChild(anchor);
      }
      return container;
    };
  }

  return Pagination;
});
