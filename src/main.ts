class DrawingApp {
  private classCanvas: HTMLCanvasElement;
  private classContext: CanvasRenderingContext2D;
  private displayCanvas: HTMLCanvasElement;
  private displayCtx: CanvasRenderingContext2D;
  private previewCanvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private img: HTMLImageElement;
  private lassoing: boolean;
  private panning: boolean;
  private path: Path2D;

  // private colors: string[] = ['rgb(1,0,0)'];
  private maxCanvasWidth = 500;
  private userZoom = 1;
  private intrinsicZoom = 1;
  private _Sx = 0;
  private _Sy = 0;
  private _sWidth = 0;
  private _sHeight = 0;
  private _panStartX = 0;
  private _panStartY = 0;

  constructor() {
    this.displayCanvas = document.createElement('canvas');
    const div = document.getElementById('yikes');
    div.appendChild(this.displayCanvas);
    this.displayCanvas.width = 200;

    const displayCtx = this.displayCanvas.getContext('2d');
    displayCtx.lineCap = 'round';
    displayCtx.lineJoin = 'round';
    displayCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    displayCtx.lineWidth = 2;
    this.displayCtx = displayCtx;
    this.displayCtx.fillStyle = 'rgba(50, 200, 100, .7)'; //'#a4fae3';

    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.id = 'preview';
    this.displayCanvas.parentNode.appendChild(this.previewCanvas);
    this.context = this.previewCanvas.getContext('2d');

    // this can be an offscreen canvas after https://bugzil.la/1390089
    this.classCanvas = document.createElement('canvas');
    this.classContext = this.classCanvas.getContext('2d');

    this.img = new Image();
    this.img.src = 'colonies.png';
    this.img.onload = (): void => {
      const aspectRatio = this.img.width / this.img.height;

      if (this.img.width > this.maxCanvasWidth) {
        this.displayCanvas.width = this.maxCanvasWidth;
        this.displayCanvas.height = this.displayCanvas.width / aspectRatio;
        this.intrinsicZoom = this.img.width / this.maxCanvasWidth; // / this.img.width;
      } else {
        this.displayCanvas.width = this.img.width;
        this.displayCanvas.height = this.img.height;
      }
      this.previewCanvas.width = this.displayCanvas.width;
      this.previewCanvas.height = this.displayCanvas.height;

      this._sHeight = this.img.height;
      this._sWidth = this.img.width;
      // classCanvas should have the same size as the original image, and be drawn scaled.
      this.classCanvas.width = this.img.width;
      this.classCanvas.height = this.img.height;
      this.context.fillStyle = 'rgba(255, 0, 0, .3)'; //'#a4fae3';
      this.context.lineWidth = 2;
      this.classContext.fillStyle = 'rgb(0,255,255)';
      this.context.imageSmoothingEnabled = true;
      this.displayCtx.imageSmoothingEnabled = false;
      this.classContext.imageSmoothingEnabled = false;
      this.path = new Path2D();
      this.drawImageScaled();
    };

    this.lassoing = false;
    this.createUserEvents();
    document.getElementById('color1').addEventListener('click', () => {
      this.classContext.fillStyle = 'rgb(255,0,0)';
    });
    document.getElementById('color2').addEventListener('click', () => {
      this.classContext.fillStyle = 'rgb(0,255,0)';
    });
  }
  private createUserEvents(): void {
    this.previewCanvas.addEventListener('mouseout', this._mouseOut);
    this.previewCanvas.addEventListener('mouseenter', this._mouseEnter);
    this.previewCanvas.addEventListener('mousedown', this._mouseDown);
    this.previewCanvas.addEventListener('mouseup', this._mouseUp);
    this.previewCanvas.addEventListener('mousemove', this._mouseMove);
    this.previewCanvas.addEventListener('wheel', this._wheel);
    this.previewCanvas.addEventListener('contextmenu', e => {
      e.preventDefault();
    });
  }

  private drawImageScaled(): void {
    // at some point should consider: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    // to not always scale the image. But maybe not necessary, I still seem to get 60 fps
    // according to the firefox devtools performance thing
    this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    const img = this.img;
    this.displayCtx.drawImage(
      img,
      this._Sx, // sx
      this._Sy, // sy
      this._sWidth,
      this._sHeight,
      0, // dx
      0, // dy
      this.displayCanvas.width,
      this.displayCanvas.height
    );
    this.displayCtx.globalAlpha = 0.4;

    this.displayCtx.drawImage(
      this.classCanvas,
      this._Sx, // sx
      this._Sy, // sy
      this._sWidth,
      this._sHeight,
      0, // dx
      0, // dy
      this.displayCanvas.width,
      this.displayCanvas.height
    );
    this.displayCtx.globalAlpha = 1;
  }

  private canvasCoords(e: MouseEvent): [number, number] {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    mouseX -= this.previewCanvas.offsetLeft;
    mouseY -= this.previewCanvas.offsetTop;
    return [mouseX, mouseY];
  }

  private _mouseUp = (e: MouseEvent): void => {
    if (this.lassoing) {
      this.context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      this.path.closePath();
      this.displayCtx.fill(this.path);
      this.context.save();
      this.context.fillStyle = 'rgb(255, 10, 100)';
      this.context.fill(this.path);
      this.classContext.drawImage(
        this.previewCanvas,
        0,
        0,
        this.previewCanvas.width,
        this.previewCanvas.height,
        this._Sx,
        this._Sy,
        this._sWidth,
        this._sHeight
      );
      this.context.restore();
      this.drawImageScaled();
      this.lassoing = false;
      this.context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }
    this.panning = false;
  };

  private _mouseMove = (e: MouseEvent): void => {
    if (this.lassoing) {
      this.context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      const [mouseX, mouseY] = this.canvasCoords(e);
      this.path.lineTo(mouseX, mouseY);
      const closedPath = new Path2D(this.path);
      closedPath.closePath();
      this.context.fill(closedPath);
      this.context.setLineDash([15, 5]);
      this.context.stroke(this.path);
    } else if (this.panning) {
      const [x, y] = this.canvasCoords(e);
      this._Sx = this._panStartX - (x * this.intrinsicZoom) / this.userZoom;
      this._Sy = this._panStartY - (y * this.intrinsicZoom) / this.userZoom;
      this.drawImageScaled();
    }
  };

  // gotta be an arrow function so we can keep on
  // using this to refer to the Drawing rather than
  // the clicked element
  private _mouseDown = (e: MouseEvent): void => {
    const [mouseX, mouseY] = this.canvasCoords(e);
    if (e.button === 0) {
      this.path = new Path2D();
      this.path.moveTo(mouseX, mouseY);
      this.lassoing = true;
    } else if (e.button === 1 || e.button === 2) {
      this._panStartX = this._Sx + (mouseX * this.intrinsicZoom) / this.userZoom;
      this._panStartY = this._Sy + (mouseY * this.intrinsicZoom) / this.userZoom;
      this.panning = true;
      e.preventDefault();
    }
  };

  private clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(min, num), max);
  }
  private _mouseOut = (e: MouseEvent): void => {
    // probably could use a _mouseEnter listener as well
    // to detect if you leave with the mouse down and then release the mouse
    // then re-enter


    // maybe need to check that its not also triggering a mousemove when re-entering
    if (this.lassoing) {
      let [mouseX, mouseY] = this.canvasCoords(e);
      mouseX = this.clamp(mouseX, 1, this.previewCanvas.width);
      mouseY = this.clamp(mouseY, 1, this.previewCanvas.height);
      this.path.moveTo(mouseX, mouseY);
      
      console.log(mouseX);
      console.log(mouseY);
      e.preventDefault();
    }
    this.panning = false;
  };

  // this currently doesn't work very well. seems like the coordinates are outside 
  // the acutal canvas area???
  private _mouseEnter = (e: MouseEvent): void => {
    if (this.lassoing) {
      if (e.buttons === 0) {
        this.lassoing = false;
      } else {
        const [mouseX, mouseY] = this.canvasCoords(e);
        console.log(mouseX);
        console.log(mouseY);
        this.path.moveTo(mouseX, mouseY);
        // return;// this.path.moveTo(...this.canvasCoords(e));
      }
    }
  };

  private _wheel = (e: MouseWheelEvent): void => {
    let scale;
    if (e.deltaY < 0) {
      scale = 1.1;
    } else if (e.deltaY > 0) {
      scale = 1 / 1.1;
    }
    const [x, y] = this.canvasCoords(e);
    const left = (x * this.intrinsicZoom) / this.userZoom;
    const down = (y * this.intrinsicZoom) / this.userZoom;
    const X = this._Sx + left;
    const Y = this._Sy + down;
    this.userZoom *= scale;
    this._sWidth /= scale;
    this._sHeight /= scale;
    const newLeft = left / scale;
    const newDown = down / scale;
    this._Sx = X - newLeft;
    this._Sy = Y - newDown;

    // currently this is somewhat jerky if you have also panned to outside the image bounds
    // not sure how to easily fix that - but doesn't seem that crucial
    if (this._sWidth > this.img.width) {
      this._Sx = (this.img.width - this._sWidth) / 2;
      this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    }
    if (this._sHeight > this.img.height) {
      this._Sy = (this.img.height - this._sHeight) / 2;
      this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    }
    this.drawImageScaled();
    e.preventDefault();
  };
}

window.onload = () => {
  new DrawingApp();
};
