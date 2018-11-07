#! /usr/bin/env python

import image_annotation_parser as iap
import cv2
import numpy

if __name__ == "__main__":
    parser = iap.read("../data/annotations/data_images_1_annotation.png")
    print(parser.get_classes())

    mask = parser.get_mask("leaf", binary=True)
    mask = numpy.dstack((mask, mask, mask))
    mask = mask.astype("uint8")
    binary_mask = mask.copy()
    mask *= 40
    
    print(mask.shape)

    cv2.imshow("Leaves", mask)
    cv2.waitKey(0)

