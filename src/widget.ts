// Copyright (c) Ian Hunt-Isaak
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel, DOMWidgetView, ISerializers
} from '@jupyter-widgets/base';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

// Import the CSS
import '../css/widget.css'


export
class segmentModel extends DOMWidgetModel {
  defaults() {
    return {...super.defaults(),
      _model_name: segmentModel.model_name,
      _model_module: segmentModel.model_module,
      _model_module_version: segmentModel.model_module_version,
      _view_name: segmentModel.view_name,
      _view_module: segmentModel.view_module,
      _view_module_version: segmentModel.view_module_version,
      value : 'Hello World',
      width: 700,
      height: 500
    };
  }

  static serializers: ISerializers = {
      ...DOMWidgetModel.serializers,
      // Add any extra serializers here
    }
  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);

    this.displayCanvas = document.createElement('canvas');
    this.previewCanvas = document.createElement('canvas');
    this.canvas = document.createElement('canvas');
    this.context = getContext(this.canvas);
    this.displayContext = getContext(this.displayCanvas);
    this.previewContext= getContext(this.previewCanvas);
    this.previewCanvas.id='preview';
    this.resizeCanvas();

    this.on('msg:custom', this.onCommand.bind(this));
  }

  private onCommand(command: any, buffers: any){
    console.log('handling command');
    if (command.name === 'gogogo') {
      console.log('in command zone');
      this.displayContext.fillStyle='rgba(255,150,0,.5';
      this.displayContext.fillRect(50,50,200,200);
      this.previewContext.fillStyle = 'black';
      this.previewContext.fillRect(300,100,100,300);
    }
  }

  private resizeCanvas() {
    this.displayCanvas.setAttribute('width', this.get('width'));
    this.displayCanvas.setAttribute('height', this.get('height'));
    this.previewCanvas.setAttribute('width', this.get('width'));
    this.previewCanvas.setAttribute('height', this.get('height'));
  }
  static model_name = 'segmentModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'segmentView';   // Set to null if no view
  static view_module = MODULE_NAME;   // Set to null if no view
  static view_module_version = MODULE_VERSION;
  canvas: HTMLCanvasElement;
  displayCanvas: HTMLCanvasElement;
  previewCanvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  displayContext: CanvasRenderingContext2D;
  previewContext: CanvasRenderingContext2D;

  // views: Dict<Promise<CanvasView>>;
}


export
class segmentView extends DOMWidgetView {
  render() {
    const container = document.createElement('div');
    container.setAttribute('position', 'relative');
    // container.style.position = 'relative';
    this.el.appendChild(container);
    // this.model.previewCanvas.style.position = 'absolute';
    container.appendChild(this.model.displayCanvas);
    container.appendChild(this.model.previewCanvas);

  }

  // value_changed() {
  //   this.el.textContent = this.model.get('value');
  // }
  // private resizeCanvas() {
  //   this.canvas.setAttribute('width', this.model.get('width'));
  //   this.canvas.setAttribute('height', this.model.get('height'));
  // }
  model: segmentModel;
  canvas: HTMLCanvasElement;
  displayCanvas: HTMLCanvasElement;
  previewCanvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  displayContext: CanvasRenderingContext2D;
  previewContext: CanvasRenderingContext2D;
}

// taken from ipycanvas
function getContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw 'Could not create 2d context.';
  }
  return context;
}
