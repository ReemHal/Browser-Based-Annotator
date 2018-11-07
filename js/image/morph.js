/** Image morphology operations and index image I/O.
 *
 * Copyright 2015  Kota Yamaguchi
 */

 // Modified by: Reem K. Al-Halimi, March/2017
 // Saves (encodes) the RGB data of image pixels into a one dimentional int32 array where each pixel is represented by four array elements.
 // and decodes that information back into image pixels

define(["./compat",
        "./morph/max-filter"],
function (compat, maxFilter) {
  function decodeIndexImage(imageData) {
    var indexImage = {
      width: imageData.width,
      height: imageData.height,
      data: new Int32Array(imageData.width * imageData.height)
    };
    for (var i = 0; i < imageData.data.length; ++i) {
      var offset = 4 * i;
      indexImage.data[i] = (imageData.data[offset]) |
                           (imageData.data[offset + 1] << 8) |
                           (imageData.data[offset + 2] << 16);  // This function is the reverse of the encoding function below.
    }
    return indexImage;
  }

  function encodeIndexImage(indexImage) {
    var imageData = compat.createImageData(indexImage.width, indexImage.height);
    for (var i = 0; i < indexImage.length; ++i) {
      var offset = 4 * i,
          value = indexImage.data[i];
      imageData.data[offset] = 255 & value;  // 255 in binary is 11111111. 255 & value puts first 8 bits of value binary in imageData.data[offset]
      imageData.data[offset + 1] = 255 & (value >>> 8); // value >>> 8 shifts value by 8 bits to the right (zero fill right shift). same as dividing value by 2**8
      imageData.data[offset + 2] = 255 & (value >>> 16); // similar to the prev line . Divides value by 2**16
      imageData.data[offset + 3] = 255;
    }
    return imageData;
  }

  return {
    encodeIndexImage: encodeIndexImage,
    decodeIndexImage: decodeIndexImage,
    maxFilter: maxFilter
  };
});
