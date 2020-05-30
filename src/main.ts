class DrawingApp {
  private classCanvas: HTMLCanvasElement;
  private classContext: CanvasRenderingContext2D;
  private displayCanvas: HTMLCanvasElement;
  private displayCtx: CanvasRenderingContext2D;
  private previewCanvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private img: HTMLImageElement;
  private lassoing: boolean;
  private path: Path2D;

  // private colors: string[] = ['rgb(1,0,0)'];
  private maxCanvasWidth = 500;
  private aspectRatio = 1;

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
    // this.displayCanvas = this.displayCanvas;
    this.displayCtx = displayCtx;
    this.displayCtx.fillStyle = 'rgba(50, 200, 100, .7)'; //'#a4fae3';

    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.id = 'preview';
    this.displayCanvas.parentNode.appendChild(this.previewCanvas);
    this.context = this.previewCanvas.getContext('2d');

    // this can be an offscreen canvas after https://bugzil.la/1390089
    this.classCanvas = document.createElement('canvas');
    this.classContext = this.classCanvas.getContext('2d');
    // this.classCanvas.width = this.displayCanvas.width;
    // this.classCanvas.height = this.displayCanvas.height;
    // this.classContext.fillStyle = this.colors[0];

    this.img = new Image();
    this.img.src = 'colonies.png';
    this.img.onload = (): void => {
      this.aspectRatio = this.img.width / this.img.height;
      if (this.img.width > this.maxCanvasWidth) {
        this.displayCanvas.width = this.maxCanvasWidth;
        this.displayCanvas.height = this.displayCanvas.width / this.aspectRatio;
      } else {
        this.displayCanvas.width = this.img.width;
        this.displayCanvas.height = this.img.height;
      }
      this.previewCanvas.width = this.displayCanvas.width;
      this.previewCanvas.height = this.displayCanvas.height;
      this.classCanvas.width = this.displayCanvas.width;
      this.classCanvas.height = this.displayCanvas.height;
      this.context.fillStyle = 'rgba(255, 0, 0, .3)'; //'#a4fae3';
      this.context.lineWidth = 2;
      this.classContext.fillStyle = 'rgb(0,255,255)';
      this.context.imageSmoothingEnabled = true;
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
    this.previewCanvas.addEventListener('mousedown', this._mouseDown);
    this.previewCanvas.addEventListener('mouseup', this._mouseUp);
    this.previewCanvas.addEventListener('mousemove', this._mouseMove);
  }

  private drawImageScaled(): void {
    // should try to follow tips here: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    // to not always scale the image.
    const canvas = this.displayCanvas;
    const img = this.img;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    // const shiftX = (canvas.width - img.width * ratio) / 2;
    // const shiftY = (canvas.height - img.height * ratio) / 2;
    this.displayCtx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      // shiftX,
      // shiftY,
      0,
      0,
      img.width * ratio,
      img.height * ratio
    );
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
      this.context.fillStyle = 'rgba(255, 10, 100, 55)';
      this.context.fill(this.path);
      this.context.restore();
      this.drawImageScaled();
      this.lassoing = false;
      // this.classContext.fillStyle = 'rgb('
      this.classContext.fill(this.path);
      // this.displayCtx.drawImage(this.img, 0, 0);
      this.displayCtx.globalAlpha = 0.4;
      this.displayCtx.drawImage(this.classCanvas, 0, 0);
      // this.displayCtx.fillStyle = 'rgb(255,0,0)';
      // this.displayCtx.drawImage(this.previewCanvas, 0, 0);
      this.displayCtx.globalAlpha = 1;
      this.context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    }
  };

  private _mouseMove = (e: MouseEvent): void => {
    console.log(this.lassoing);
    if (this.lassoing) {
      this.context.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      const [mouseX, mouseY] = this.canvasCoords(e);
      this.path.lineTo(mouseX, mouseY);
      const closedPath = new Path2D(this.path);
      closedPath.closePath();
      this.context.fill(closedPath);
      this.context.setLineDash([15, 5]);
      this.context.stroke(this.path);
    }
  };

  // gotta be an arrow function so we can keep on
  // using this to refer to the Drawing rather than
  // the clicked element
  private _mouseDown = (e: MouseEvent): void => {
    const [mouseX, mouseY] = this.canvasCoords(e);
    this.path = new Path2D();
    this.path.moveTo(mouseX, mouseY);
    // probs need to check the mousebutton here
    // also if already lassoing, otherwise it possible to start multiple lassos
    this.lassoing = true;
  };
}

window.onload = () => {
  new DrawingApp();
};
