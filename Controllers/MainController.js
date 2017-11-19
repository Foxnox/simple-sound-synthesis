
if (app){
  app.controller("MainController", function(){
    
    this.carrierFrequency = 440;
    this.frequencyModulating = 5;
    this.amplitude = 0.5;
    this.amplitude2 = 0.5;
    this.startedOnce = false;
    this.synthesis_mode = "sin";
    this.c = 0.;
    this.I = 5.0;
    this.playing = false;
    
    this.audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
    if (this.audioCtx == null){
      alert("Your browser does not support web audio API, sorry.")
    }
    

    this.sinAudioBuff = new CustomAudioBuffer(this.audioCtx);
    
    var args = {};
    args.a = this.amplitude;
    args.f = this.carrierFrequency;
    this.sinAudioBuff.updateSoundArray(args);

    this.play = function(){
      if (!this.playing){
	this.playing = true;
	this.sinAudioBuff.start();
      }
    };

    this.stop = function(){
      if (this.playing){
	this.playing = false;
	this.sinAudioBuff.stop();
      }
    };

    this.update_sound = function (){
      let wasPlaying = this.playing;
      this.stop();

      let args = {};
      switch (this.synthesis_mode){
      case "sin" :
	args.a = this.amplitude;
	args.f = this.carrierFrequency;
	break;
      case "add" :
	args.a1 = this.amplitude;
	args.f1 = this.carrierFrequency;
	args.a2 = this.amplitude2;
	args.f2 = this.frequencyModulating;
	break;
      case "am" :
	args.c = this.c;
	args.a = this.amplitude;
	args.fm = this.frequencyModulating;
	args.fc = this.carrierFrequency;
	break;
      case "fm" :
	args.I = this.I;
	args.a = this.amplitude;
	args.fm = this.frequencyModulating;
	args.fc = this.carrierFrequency;
	break;
      case "shepard" :
	args.f = this.carrierFrequency;
	break;
      default:
	break;
      }
      this.sinAudioBuff.updateSoundArray(args);

      if (wasPlaying)
	this.play();
    };

    this.update_sythesis_mode = function () {
      this.stop();
      this.sinAudioBuff.updateMode(this.synthesis_mode);
      this.update_sound();
    };

    this.log = function (message) {
      console.log(message);
    };
  });
}
