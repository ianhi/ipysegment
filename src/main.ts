class DrawingApp {
  private classCanvas: HTMLCanvasElement;
  private classContext: CanvasRenderingContext2D;
  private imgCanvas: HTMLCanvasElement;
  private imgContext: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private img: HTMLImageElement;
  private lassoing: boolean;
  private path: Path2D;

  private clickX: number[] = [];
  private clickY: number[] = [];

  private colonyCount = 0;
  private colonyCountDisplay: HTMLElement;
  constructor() {
    const imgCanvas = document.getElementById(
      'img-canvas'
    ) as HTMLCanvasElement;

    const imgContext = imgCanvas.getContext('2d');
    imgContext.lineCap = 'round';
    imgContext.lineJoin = 'round';
    imgContext.fillStyle = 'rgba(255, 0, 0, 0.5)';
    imgContext.lineWidth = 2;
    this.imgCanvas = imgCanvas;
    this.imgContext = imgContext;
    this.imgContext.fillStyle = 'rgba(50, 200, 100, .7)'; //'#a4fae3';

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'preview';
    this.canvas.width = this.imgCanvas.width;
    this.canvas.height = this.imgCanvas.height;
    this.imgCanvas.parentNode.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = 'rgba(255, 0, 0, .3)'; //'#a4fae3';
    this.context.lineWidth = 2;
    this.path = new Path2D();

    // this can be an offscreen canvas after https://bugzil.la/1390089
    this.classCanvas = document.createElement('canvas');
    this.classContext = this.classCanvas.getContext('2d');
    this.classCanvas.width = this.imgCanvas.width;
    this.classCanvas.height = this.imgCanvas.height;
    this.classContext.fillStyle = 'rgb(1,0,0)';
    this.context.imageSmoothingEnabled = true;

    this.colonyCountDisplay = document.getElementById('colonyCounter');

    this.img = new Image();
    this.img.src = 'colonies.png';
    this.img.onload = (): void => {
      this.drawImageScaled();
    };

    //this.redraw();
    this.lassoing = false;
    this.createUserEvents();
  }
  private createUserEvents(): void {
    this.canvas.addEventListener('mousedown', this._mouseDown);
    this.canvas.addEventListener('mouseup', this._mouseUp);
    this.canvas.addEventListener('mousemove', this._mouseMove);

    document
      .getElementById('clear')
      .addEventListener('click', this.clearEventHandler);
  }

  private drawImageScaled(): void {
    const canvas = this.imgContext.canvas;
    const img = this.img;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const shiftX = (canvas.width - img.width * ratio) / 2;
    const shiftY = (canvas.height - img.height * ratio) / 2;
    this.imgContext.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      shiftX,
      shiftY,
      img.width * ratio,
      img.height * ratio
    );
  }

  private addClick(x: number, y: number): void {
    this.clickX.push(x);
    this.clickY.push(y);
    this.colonyCount++;
    this.updateCounterDisplay();
  }

  private updateCounterDisplay(): void {
    this.colonyCountDisplay.innerHTML =
      'Colony Count : ' + this.colonyCount.toString();
  }

  private clearCanvas(): void {
    this.drawImageScaled();
    this.clickX = [];
    this.clickY = [];
  }

  private canvasCoords(e: MouseEvent): [number, number] {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;
    return [mouseX, mouseY];
  }
  private clearEventHandler = (): void => {
    ///    this.imgContext.scale(.5,.5);
    this.clearCanvas();
  };

  private _mouseUp = (e: MouseEvent): void => {
    if (this.lassoing) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.path.closePath();
      this.imgContext.fill(this.path);
      this.context.save();
      this.context.fillStyle = 'rgba(100, 250, 100, 255)';
      this.context.fill(this.path);
      this.context.restore();
      //      this.imgContext.drawImage(this.canvas, 0, 0);
      this.lassoing = false;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.classContext.fill(this.path);
      this.drawImageScaled();
      // this.imgContext.drawImage(this.img, 0, 0);
      this.imgContext.globalAlpha = 0.4;
      this.imgContext.drawImage(this.classCanvas, 0, 0);
      this.imgContext.globalAlpha = 1;
    }
  };

  private _mouseMove = (e: MouseEvent): void => {
    console.log(this.lassoing);
    if (this.lassoing) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.addClick(mouseX, mouseY);
    this.lassoing = true;
  };
}

new DrawingApp();
