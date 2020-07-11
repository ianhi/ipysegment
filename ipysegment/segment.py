#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Ian Hunt-Isaak.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, Color
from ._frontend import module_name, module_version
from .utils import binary_image
from numpy import frombuffer, uint8, copy
import zlib
from ipydatawidgets import shape_constraints, DataUnion, data_union_serialization
import numpy as np
# from ipydatawidgets.traits import shape_constraints

from traitlets import Bytes, Bool, CInt, Unicode
import logging
logger = logging.getLogger()
# import sys


def deserializeImage(json, obj):
    logger.debug('yikes')
    logger.debug('deserializing:', json)
    _bytes = None if json['data'] is None else json['data'].tobytes()
    if _bytes is not None:
        # print(sys.getsizeof(_bytes))
        _bytes = zlib.decompress(_bytes)
        # print(sys.getsizeof(_bytes))
        # copy to make it a writeable array - not necessary, but nice
        obj.labels = copy(
            frombuffer(_bytes, dtype=uint8).reshape(
                json['width'],
                json['height'],
                4))
    return _bytes


labels_serialization = {
    'from_json': deserializeImage,
}

class segmenter(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('segmentModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('segmentView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    classColor = Color('red').tag(sync=True)
    erasing = Bool(True).tag(sync=True)
    # underlying info for labels - this handles the syncing to ts
    _labels = Bytes(default_value=None, allow_none=True, read_only=True).tag(sync=True, **labels_serialization)
    # yikes = 

    data = DataUnion(
        np.zeros([10, 10, 4], dtype=np.uint8),
        dtype='uint8', shape_constraint=shape_constraints(None, None, 4),  # 2D RGBA
    ).tag(sync=True, **data_union_serialization)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.on_msg(self.handle_msg)

    width = CInt(700).tag(sync=True)
    height = CInt(700).tag(sync=True)

    def set_image(self, arr):
        """
        Set the image to be segmented
        arr : numpy array
            Shape (WxHx1) or (WxHx3)
        TODO: transparency here? I removed the transparency enabling code
        on the typescript side to make things simpler with the class canvas
        """
        image_metadata, image_buffer = binary_image(arr)
        command = {
            'name': 'image',
            'metadata': image_metadata
        }
        self.send(command, (image_buffer,))

    def gogogo(self):
        command = {
            'name': 'gogogo'
        }
        self.send(command, [])

    def beep(self):
        command = {
            'name': 'beep'
        }
        self.send(command, [])
    def gimme(self):
        command = {
            'name': 'gimme'
        }
        self.send(command, [])


    def handle_msg(self, widget, content, buffers):
        # print('widget:', widget)
        # print(content)
        # self.gogogo()
        self.yikes(content['start'])
