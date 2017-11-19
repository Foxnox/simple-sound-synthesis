
function CustomAudioBuffer (audioCtx) {
  this.audioCtx = audioCtx;
  
  this.sampleRate = 44100;
  this.length = Math.ceil(this.sampleRate);
  
  this.soundArray = new Float32Array(this.length);

  this.arrayBuffer = audioCtx.createBuffer(1, this.length, this.sampleRate);
  this.arrayBuffer.copyToChannel(this.soundArray, 0, 0);
  
  
  this.lastTimeUpdate = 0;
  this.timeThreshold = 50;
  
  this.started = false;

  this.analyser = this.audioCtx.createAnalyser();
  let visualizeContainer = document.getElementById("visualize");
  this.visualizer = this.buildVisualizer(visualizeContainer.getBoundingClientRect().width, visualizeContainer.getBoundingClientRect().height, this.analyser);
  

  this.mode = "sin";
  this.synthesisMethods = {
    "sin" : sinus_synthesis,
    "add" : additive_synthesis,
    "am" : am_synthesis,
    "fm" : fm_synthesis
  };
};

CustomAudioBuffer.prototype.updateSoundArray = function (args) {
  var time = Date.now();
  if (time - this.lastTimeUpdate >= this.timeThreshold){
    console.log("ici");
    for (let index = 0; index < this.length; ++index){
      args.t = index / this.sampleRate;
      this.soundArray[index] = this.synthesisMethods[this.mode](args);
    }
    this.arrayBuffer.copyToChannel(this.soundArray, 0, 0);
    this.lastTimeUpdate = Date.now();
  }
};

CustomAudioBuffer.prototype.start = function() {
  if (!this.started){
    if (this.audioBuffer){
      this.audioBuffer.connect(this.audioCtx.destination);
      this.audioBuffer.connect(this.analyser);
      this.audioBuffer.start();
      this.visualizer.start();
      this.started = true;
    } else {
      this.audioBuffer = this.audioCtx.createBufferSource();
      this.audioBuffer.loop = true;
      this.audioBuffer.buffer = this.arrayBuffer;
      this.audioBuffer.connect(this.audioCtx.destination);
      this.start();
    }
  } 
};

CustomAudioBuffer.prototype.stop = function () {
  if (this.audioBuffer && this.started){
    this.audioBuffer.stop();
    this.visualizer.stop();
    this.audioBuffer.disconnect(this.analyser);
    this.audioBuffer.disconnect(this.audioCtx.destination);
    this.audioBuffer = null;
    this.started = false;
  }
};

CustomAudioBuffer.prototype.updateMode = function (mode){
  this.mode = mode;
};

CustomAudioBuffer.prototype.buildVisualizer = function(width, height, analyserNode) {
  let self = this;

  let visualizeZone = document.getElementById("visualisationTarget");

  let canvasContext = visualizeZone.getContext("2d"); 

  let canvasWidth = width;
  visualizeZone.width = width;

  let canvasHeight = height;
  visualizeZone.height = canvasHeight;

  canvasContext.width = canvasWidth;
  canvasContext.height = canvasHeight;

  let canvasData = {
    "canvas" : visualizeZone,
    "width" : canvasWidth, 
    "height" : canvasHeight 
  };

  let visualizer = new SoundVisualizer(canvasData, analyserNode, 2048);
  
  return visualizer;
};
