class SoundVisualizer {
	constructor (canvasData, analyserNode, fftSize) {
		if (canvasData && 
			canvasData.hasOwnProperty("canvas") &&
			canvasData.hasOwnProperty("width") &&
			canvasData.hasOwnProperty("height")) 
		{
			this.canvasContext = canvasData.canvas.getContext("2d");
			
			this.canvas = canvasData.canvas;
			
			this.widthWindowToCanvasRatio = canvasData.width / window.innerWidth;
			this.heightWindowToCanvasRatio = canvasData.height / window.innerHeight;
			
			this.canvasWidth = canvasData.width;
			this.canvasHeight = canvasData.height;	
		} else {
			alert("Your browser does not support the canvas/webGL api, sorry");
		}
		
		if (analyserNode) {
			this.analyser = analyserNode;
		} else {
			console.log ("You need to provide an analysr node to visualize the sound");
			alert("An error occurs, please see the log message into the console");
		}
		
		
		this.freqColor = 'rgb(209, 184, 0)';
		this.timeColor = 'rgb(0, 163, 116)';
		this.origColor = 'rgb(99, 100, 102)';
		
		this.bgColor = 'rgb(55, 63, 61)';
		
		this.fftSize = fftSize ? fftSize : 2048;
		
		this.analyser.smoothingTimeConstant = 0.3;
    	this.analyser.fftSize = this.fftSize;
		
		this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    	this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
		
		this.XAxisYPos = this.canvasHeight/2;
		
		this.requestId;
		
		let self = this;
		
		window.onresize = function () {
			self.canvasWidth = self.widthWindowToCanvasRatio * window.innerWidth;
			self.canvasHeight = self.heightWindowToCanvasRatio * window.innerHeight;
			
			self.XAxisYPos = self.canvasHeight/2;
			
			self.canvas.height = self.canvasHeight;
			self.canvas.width = self.canvasWidth;
			
			self.preRender();
		};
		
		this.preRender();
	}
	
	start() {
		if (!this.requestId) {
			this.update();
		}
	}
	
	stop() {
		if (this.requestId) {
			cancelAnimationFrame(this.requestId);
			this.requestId = undefined;
			this.preRender();
		}
	}
	
	update() {
		this.requestId = requestAnimationFrame(this.update.bind(this));
		
		this.analyser.getByteFrequencyData(this.freqData);
    	this.analyser.getByteTimeDomainData(this.timeData);
		
		
		
		this.render();
	}
	
	preRender () {
		this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.canvasContext.fillStyle = this.bgColor;
      	this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		 
		this.drawXAxis();
	}
	
	clear() {
		this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}
	
	render () {
		this.preRender();
		  
		this.drawData(this.freqData, 2, this.freqColor, true);
		this.drawData(this.timeData, 2, this.timeColor, false);
	}
	
	drawXAxis () {
		this.canvasContext.lineWidth = 1;
		this.canvasContext.strokeStyle = this.origColor;
		
		this.canvasContext.beginPath();
		this.canvasContext.moveTo(0, this.XAxisYPos);
		this.canvasContext.lineTo (this.canvasWidth, this.XAxisYPos);
		
		this.canvasContext.stroke();
		
	}
	
	// data, 2 , 'rgb(...)', 128.0
	drawData (data, lineWidth, color, double) {
		if (data){
			this.canvasContext.lineWidth = lineWidth;
			this.canvasContext.strokeStyle = color;
			
			this.canvasContext.beginPath();
			
			let uint8max = 255;

			let segWidth = (this.canvasWidth * 1.0) / this.analyser.frequencyBinCount;
			let actualPos = 0;
			let yneg = 0;
			let ypos;
			let oldypos = ypos;
			
			for (let i = 0; i < this.analyser.frequencyBinCount; ++i){
				let v = data[i];
				// double == true
				let relValue = v / uint8max;
				let yrel = (relValue * 0.9 *(this.canvasHeight/2));
				ypos = yrel + this.XAxisYPos ;
				yneg = -1 * yrel + this.XAxisYPos;
				// double == false
				let yrelMid = ((v - uint8max/2) / uint8max) * 0.9 * this.canvasHeight;
				let ymid = yrelMid + this.XAxisYPos;
				if (double){
					if (i ==0) {
						this.canvasContext.moveTo(actualPos, yneg);
					} else {
						this.canvasContext.lineTo(actualPos, yneg);
						this.canvasContext.moveTo(actualPos - segWidth, oldypos);
						this.canvasContext.lineTo(actualPos, ypos);					
						this.canvasContext.moveTo(actualPos, yneg);
					}	
				} else {
					if (i ==0) {
						this.canvasContext.moveTo(actualPos, ymid);
					} else {
						this.canvasContext.lineTo(actualPos, ymid);
					}
				}
				
				oldypos = ypos;
				actualPos += segWidth;
			}
			
			this.canvasContext.lineTo(this.canvasWidth, this.canvasHeight/2);
			this.canvasContext.stroke();
		}
		
	}
}