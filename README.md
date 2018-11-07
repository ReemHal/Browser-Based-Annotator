A Web-based Tool for Image Annotation
====================

The image annotation tool is an online tool for labeling objects within RGBA images.
The tool is based on the open source Js Segment Annotation Tool developed by Kota Yamaguchi [1](#ref1). It is browser-based and is, therefor, compatible with a wide variety of platforms.  The tool is designed for versatility and ease of use to allow users to efficiently label large numbers of images.
For more detail on how to use the tool please refer to the [User Guide](https://gitlab.guelphrobolab.ca/lab-tools/js-segment-annotator/blob/master/UserGuide.pdf).

What’s new in this version
====================
To achieve our goal of creating a versatile, easy to use labeling tool, we introduce several features including:

1.	Multi-labeled segments: image segments can be annotated with more than a single label simultaneously. The same segment can represent a tomato and an unripe fruit.
2.	Segment overlap: annotated segments are not required to be disjoint. An object can be labeled as a t-shirt and a portion of it can also be labeled as a logo.
3.	Efficient annotation of disconnected objects: annotated objects are not required to be composed of continuous segments. For example, if a tomato is partially hidden behind a stem. The disjoint visible parts can be annotated as part of a single tomato without including the stem.
4.  Marking object instances: users can annotate several instances of a car, for example, within the same image so that each car object is an independent instance. Individual objects can then be visualized using the Objects button as described below.
5.  Annotation information for an image is saved in a single png file in a new format to account for multilabels and object instances.

Getting Started
===================
Preparing your Data
-------------------
Before your first annotation session, clearly specify your label list, input images, and corresponding annotations from previous session  in a JSON file with the format:

    {
	    “labels”:[
		“label_1”,
        “label_2”,
        :
        “label_n”
   	    ],
	    “imageURLs”:[
		“image_1 full path”,
		:
		“image_n full path”
	    ],
	    “annotationURLs”:[
		    “full path to zip file containing annotation PNG files for image_1 above”,
		    “full path to zip file  containing annotation PNG files for image_2 above”,
		    :
		    “full path to zip file  containing annotation PNG files for image_n above”
	    ],
	    "annotateURL": 'url to call which annotates the image',
	    "indexInfo": {
            "showIfAnnotatedFileFound": true,
            "showIndexCount": true
        }
    }

This JSON file should be saved with a .json extension under the data directory. The JSON file name should then be updated in main.js file so it can serve as the input to the annotator.

Starting your Annotation Session
===========================
The annotator is compatible with most browsers including IE 11+, Firefox and Chrome. In your browser, open the index.html file. The main application page consists of a numbered list of your input images. Click on the image you would like to annotate.  This will take you to the annotation page for that image.
Annotating an Image
-------------------
The image annotation page
-------------------------
The image annotation page provides several ways to interact with an image:
1.	The navigator links at the top allow you to go back and forth between different images to annotate, and to go back to the main list of images (index).
2.	The buttons at the top of the image are different means of interacting with the image:
    a.	The Zoom button is to zoom in and out of the image thus allowing finer segments to be annotated.
    b.	The  Boundary button shows the superpixel segment boundaries (more on superpixels in the next point).
    c.	The Image button shows and hides the image.
    d.	The Objects button allows you to visualize your annotated segments by object . It displays each labeled object with a different color.
3.	The sidebar consists of
    a.	a clickable list of available labels.
    b.	The “undo” and “redo” buttons to remove the most recently marked segments for the current label.
    c.	The Polygon, Superpixel, and Brush buttons which are different ways of segmenting and labeling objects (describe in detail below).
    d.	The Export button saves the annotations for the current image.

Steps for labeling image segments
-----------------------------
1.	Select the label with which to annotate the segments.
2.	Select the segmentation method to apply to the image:
    a.	Use the superpixel segmentation tool to  automatically segment the image using the SLIC algorithm [2](#ref2)]. This is an efficient algorithm for automatic image segmentation that has been shown to outperform other superpixel segmentation methods in terms of boundary adherence and computational and memory efficiency.
    b.	Use the Polygon tool to draw a boundary around the object to be labeled.
    c.	Or use the brush tool to manually cover random parts of the image by passing the cursor over it.
3.	To label a segment in the image, simply move the cursor over that segment and click the left mouse button.
4.	To remove the labeling on a segment, move the cursor to that segment and click on the right mouse button.
5.	To mark the end of annotating a single object, press the space bar.
6.	At any time during the annotation process you can zoom in and out of the image, toggle the image on or off and view the annotated segments by object color using the menu on top of the image.

Annotating Polygon segments
---------------------------
To label an area of the image using the polygon tool:
1.	Select the tool from the sidebar.
2.	Move the cursor to where you would like the segment to start.
3.	While the left mouse button is down move the cursor to draw the boundary of the polygon.
4.	The polygon is complete when the cursor intersects with the polygon's starting point.
5.	To mark the end of annotating a single object, press the space bar.
6.	At any time during the annotation process you can zoom in and out of the image, toggle the image on or off and view the annotated segments by object color using the menu on top of the image.

Deleting a Polygon segment
--------------------------
To remove the labeling of a polygon segment, follow the same instructions above with the right mouse button pressed down.  This approach can be used to delete any previously labeled segment or part of a segment whether it is a polygon or a superpixel.

Annotating superpixels
-----------------------
1.	Select the Superpixel tool from the sidebar.
2.	Optional: Click on the boundary button at the top of the image to show the superpixel segment boundaries.
3.	Optional:
    a.	click on the + button beside the boundary button to increase the size of each superpixel in the image.
    b.	Or click on the – Boundary button to create smaller superpixels.
4.	As you move the cursor around the image, the superpixel segments will be highlighted.
5.	To annotate a segment, move the cursor to that superpixel and click the left mouse button.
6.	To mark the end of annotating a single object, press the space bar.
7.	At any time during the annotation process you can zoom in and out of the image, toggle the image on or off and view the annotated segments by object color using the menu on top of the image.

Deleting a Superpixel segment
------------------------------
To remove the labeling of a superpixel segment, highlight it by moving the cursor over it then click the right mouse button.  

Saving your annotations
------------------------
The export button saves all label annotations of the current image into single png file in the default download folder of your browser.

For Developers
==============

Reading your annotations in Python
----------------------------------
The package includes a Python parser that includes functions to read an annotation file for a given label and return either a binary mask representing all pixels annotated with that label, or a mask representing areas for a specific object.

`` def get_mask(self, label_name, object_number=None, binary=True) ``

Returns an array the same size as the image with 1 representing the pixel belongs to object_number and 0 elsewhere. If no object is specified, all objects with matching label will be masked as 1

Input arguments:
- `label_name`: the label to mask eg. 'tomato'
- `object_number`: optional object number
- `binary`: a boolean parameter. If set to False, the label mask is returned with all object numbers, otherwise, a binary mask is returned where 1 indicates that the pixel has `label_name`.

Main Class Descriptions
------------------------

## Layer Class

```new Layer(imageSource, options)```

* `imageSource` - can either be the full path to an image file or a canvas.
* `options` - Optional set of input arguments. Can be any combination of the following:
	* `onload`: a function definition to execute when an image is first loaded.
    * `width`: the desired canvas width.
    * `height`: the desired canvas height.
    * `onerror`: function definition to execute when an error occurs and an onerror event is triggered.
    * `imageSmoothingEnabled`:a Boolean to turn image smoothing on\off (currently not used).

## Annotator Class
```new Annotator(imageURL, options)```

The main class for image annotation functions. An Annotator object consists of several Layer objects superimposed on top of each other:
-	image: consists of a canvas containing the image being annotated.
-	superpixel:  consists of superpixel image segments as generated by the SLIC algorithm.
-	Boundary: marks the segment boundaries of the superpixel segments.
-	For each label l on the list of labels (as defined in the input JSON file):
    -	annotatedObjects Layer: a Layer where each pixel p in its canvas contains the object number if the pixel is labeled by l. Object numbers allow users to group segments within the same label into objects representing independent entities.
    -	visualization Layer object: each pixel p labeled under l  is coded by the color representing l. This is the layer that visualizes image segments labeled by l.
    -	objectVisualization Layer: This is the layer that visualizes the objects of l within the image. Each pixel p labeled under l  and belonging to object number n is coded by the color representing n.
    -   objects Array: This is an array of layers which contains the pixel visualization data for each n objects.

The `options` is an optional set of arguments and can be any of the following:
- `labels`: list of available labels.
- `colormap`: color list used to map to each label.    
- `boundaryColor`: color to use to show boundaries in boundary Layer.
- `boundaryAlpha`: opacity of boundary Layer
- `visualizationAlpha` annotation layer opacity. The higher the less opaque.
- `highlightAlpha`:  the opacity of a highlighted segment on mousemove event.
- `defaultLabel`: The background label. 0 by default. All unlabeled pixels get this value.
- `defaultObjectNumber`: All unlabeled  pixels get this value. 0 by default.
- `eraseLabel`: the value to assign a pixel when its label is removed.  Default is 0 (same as default background label).
- `maxHistoryRecord`: the size of the history list. This is the maximum amount of "undo's" we can do.
- `onchange`, `onrightclick`, `onleftclick`, `onhighlight`, `onmousemove`: event trigger functions for `onchange`, `onrightclick`, `onleftclick`, `onhighlight`, `onmousemove` events.

#### Functions related to importing and exporting image annotations:

``exportTiles()``

Saves the annotation information in a single PNG file the Downloads folder. In the saved PNG file, the annotatedObject layer for each label is saved in its one of the RGB channels in the PNG file. If there are more than 3 labels, more channels are needed. In this case, another empty RGBA image is  tiled alongside the original one in the same annotation PNG file until all label layers are saved.

``importTiles(data, id, pngData, options)``

reads the annotation files saved under the annotationURL directory and creates the corresponding visualization, annotatedObjects, and objectVisualization Layers for each label in the annotator label list (_this.labels_).

Input arguments:
- `data`: the list of full paths of the annotation files.
- `id`: the annotation file number in the `data` list.
- `pngData`: the meta data read from the 
- `options`: an optional argument defining the `onerror` function to be executed if the an error event is triggered.


Other Considerations
=====================
Updating your list of labels
----------------------------
You may update your list of labels in the input JSON file by adding or removing labels. However, the background label must remain as the first label item.

References
==========
<a name="ref1"></a>[1] Pongsate Tangseng, Zhipeng Wu, Kota Yamaguchi. Looking at Outfits to Parse Clothing.  http://arxiv.org/abs/1703.01386v1 arXiv:1703.01386 [cs.CV], March 2017.  Retrieved: June, 2017. 	

<a name="ref2"></a>[2] Radhakrishna Achanta, Appu Shaji, Kevin Smith, Aurelien Lucchi, Pascal Fua, and Sabine Süsstrunk, SLIC Superpixels Compared to State-of-the-art Superpixel Methods, IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 34, num. 11, p. 2274 - 2282, May 2012.
