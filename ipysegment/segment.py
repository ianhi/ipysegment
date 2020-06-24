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


from traitlets import Bytes, Bool, CInt, Enum, Float, Instance, List, Unicode


class segmenter(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('segmentModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('segmentView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = Unicode('Hello World').tag(sync=True)
    classColor = Color('red').tag(sync=True)
    erasing = Bool(True).tag(sync=True)

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

    def handle_msg(self, widget, content, buffers):
        # print('widget:', widget)
        # print(content)
        # self.gogogo()
        self.yikes(content['start'])
