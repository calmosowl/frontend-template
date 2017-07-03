"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
	(()=>{

if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
    enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop, handler) {
      var
      oldval = this[prop]
      , newval = oldval
      , getter = function () {
        return newval;
      }
      , setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
      }
      ;

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
          get: getter
          , set: setter
          , enumerable: true
          , configurable: true
        });
      }
    }
  });
}

// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
    enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}

		let a = new JackPotCounter({
			tickLength: 5000,
			qtyPerTick: 10,
			value: 0
		});
		
		let output = document.getElementById('output'),
			play = document.getElementById('tickPlay'),
			stop = document.getElementById('tickStop'),
			submit = document.getElementById('submitData'),
			submitTick = document.getElementById('submitTick'),
			random = document.getElementById('random'),
			inputRandom = document.getElementById('inputRandom'),
			log = document.getElementById('log'),
			input = document.getElementById('dataVal'),
			inputTick = document.getElementById('tickVal');			
	
		a.elemArr = Array.from(document.querySelectorAll('.roller'));
		a.random = random.checked;
		a.max = +document.getElementById('inputRandom').value;
		
		a.watch("currentValue", function (id, oldval, newval) {
    		return newval;
		});

		play.onclick= (ev) => {
			ev.preventDefault();
			a.random = random.checked;
			a.max = +document.getElementById('inputRandom').value;
				//a.tickPlay().echo(output);
			a.generator();
		};

		stop.onclick= (ev) => {
			ev.preventDefault();
			a.tickStop().echoStop();
			a.unwatch("currentValue");			
		};

		/*setCurrentValue*/
		submit.onclick = (ev) => {
			ev.preventDefault();
			a.random = random.checked;
			a.max = +document.getElementById('inputRandom').value;
			// if(a.random)
			// 	a.tickPlay().setRandom(a.max);

			a.setCurrentValue(input.value);
			//a.tickPlay().echo(output);
			a.run().echo(output);
		};
		input.onkeydown = (ev) => {
			if(ev.keyCode == 13){
				a.setCurrentValue(input.value);
				//a.tickPlay().echo(output);
				a.run().echo(output);
			}
		};
		/*setTickLength*/
		submitTick.onclick = (ev) => {
			ev.preventDefault();
			a.setTickLength(inputTick.value);
		};
		inputTick.onkeydown = (ev) => {
			if(ev.keyCode == 13){
				a.setTickLength(inputTick.value);
				a.getLog("\n⮡ " + a.tickLength + "ms 🢣 default interval 🢣");
			}
		};
		

	})();
}, false);



function JackPotCounter(options){
	let that = this;
	const ANGLE = 36;
	let bufferPrototype = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.buffer = bufferPrototype;
	this.timeBuffer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.data = {
		diffBetweenLatests:0,
		time: 0,
		duration: 0
	};
	this.coordinates = {
		time: [],
		rotate: [0],
		rBuffer: [],
		speed: [],
		delay: 500,
		speedAverage: 0,
		deviation: 0,
		duration: 0
	};
	this.currentValue = options&&options.value ? options.value : 0;
	this.ticker = [];
	this.echoTicker = [];
	this.elemArr = [];
	this.tickLength = options&&options.tickLength ? options.tickLength : 1000;
	this.qtyPerTick = options&&options.qtyPerTick ? options.qtyPerTick : 1;

	this.tickPlay = () => {
		if(this.ticker.length < 1){
			this.ticker[0] = setInterval(()=>{

				this.buffer.splice(0, 0, this.currentValue);
				this.buffer.length = 10;
				this.data.diffBetweenLatests = +(this.buffer[0]-this.buffer[1]).toFixed(2);
				/*-*/this.data.time = Date.now();
				this.data.arrayStamp = this.buffer.join(', ');
				/*emu*/ if(this.random) this.currentValue = this.currentValue + randomInteger(0, this.max);
				/*🕙*/	console.log(this.random);
				if(+this.data.diffBetweenLatests > 0) {
					this.timeBuffer.splice(0, 0, this.data.time);
					this.timeBuffer.length = 10;
					this.data.duration = this.timeBuffer[1] > 0 ? this.timeBuffer[0]-this.timeBuffer[1] : this.tickLength;
					this.coordinates.time = this.timeBuffer.join(', ');
					this.transform(this.elemArr);

					this.getLog("\n⮡ " + this.currentValue + " 🢣🢣🢣🢣🢣🢣🢣 random: " + this.random + " 🢣 max: " + this.max);
					this.getLog("time: " + this.coordinates.time);
					this.getLog("rotate: " + this.coordinates.rotate);
					this.getLog("speed: " + this.coordinates.speed);
					this.getLog("speedAverage: " + this.coordinates.speedAverage);
					this.getLog("deviation: " + this.coordinates.deviation);
					this.getLog("duration: " + this.coordinates.duration);
				} 
				/*🕙*/
				
				
				this.dev();
				
			}, this.tickLength);

		};
		return this;
	};

	this.generator = () => {
		if(this.ticker.length < 1 && this.random) {
			this.ticker[0] = setInterval(()=>{
				this.currentValue += randomInteger(0, this.max);
				this.transform(this.elemArr);
				this.dev();
			}, this.tickLength + 2000);
		}
		else that.run();		
	}

	this.run = () => {
		this.transform(this.elemArr);
		this.dev();
		return this;
	};

	this.dev = () => {
		//console.log(this.coordinates);
		this.getLog("\n⮡ " + this.currentValue + " 🢣🢣🢣🢣🢣🢣🢣 random: " + this.random + " 🢣 max: " + this.max);
		this.getLog("time: " + this.coordinates.time);
		this.getLog("rotate: " + this.coordinates.rotate);
		this.getLog("speed: " + this.coordinates.speed);
		this.getLog("speedAverage: " + this.coordinates.speedAverage);
		this.getLog("deviation: " + this.coordinates.deviation);
		this.getLog("duration: " + this.coordinates.duration);
		this.getLog("delay: " + this.coordinates.delay);
	    return this;
	};
	this.echo = ($) => {
		this.echoTicker[0] = setInterval(()=>{
			$.innerHTML = that.currentValue;
		},this.tickLength);
		return this;
	};
	this.echoStop = () => {
		clearInterval(this.echoTicker);
		this.echoTicker = [];
		return this;
	};
	this.tickStop = () => {
		clearInterval(this.ticker);
		this.ticker = [];
		return this;
	};
	this.getCurrentValue = () => {
		return this.currentValue;
	};

	this.setCurrentValue = (value) => {
		if(isNaN(value/2)) 
			return that.getLog('= waiting for integer =');
		return this.currentValue = value;
	};

	this.setTickLength = (value) => {
		if(isNaN(value/2)) 
			return that.getLog('= waiting for integer =');
		return this.tickLength = value;
	};

	this.setRandom = (value) => {
		return this.currentValue = this.currentValue + randomInteger(0, value);
	};

	this.getDiff = () => {
		return this.data.diffBetweenLatests;
	};

	this.controller = (rotate) => {
		this.coordinates.rotate.splice(0, 0, rotate);
		let dRotate = this.coordinates.rotate[0]-this.coordinates.rotate[1];
		this.coordinates.speed.splice(0, 0, parseInt((dRotate/(this.tickLength/1000))));
		this.coordinates.speed.length = this.coordinates.speed.length > 4 ? 4 : this.coordinates.speed.length;
		this.coordinates.speedAverage = this.coordinates.speed.reduce(function(sum, current) {return parseInt(sum + current)}) / this.coordinates.speed.length;	
		this.coordinates.deviation = (Math.sqrt(this.coordinates.speed.reduce(function(a, b) {
			var dev = b - that.coordinates.speedAverage;
			return a+dev*dev;
		})/this.coordinates.speed.length))/1000;
		this.coordinates.duration = this.coordinates.deviation > 4 ? 
									parseInt(dRotate / this.coordinates.speedAverage * 1000) :	
									this.tickLength;
	}

	this.transform = (elemArr) => {
		var arr = elemArr.slice(),
			data = that.currentValue * 100;
		for(var i = 7; i >= 0; i--) {
			var multiplier = parseInt(data / Math.pow(10, 7 - i)),
				rotate = multiplier * ANGLE;
			if(i == 7) {that.controller(rotate);}

			this.coordinates.rBuffer[i] = this.coordinates.rBuffer[i] ? rotate - this.coordinates.rBuffer[i] : rotate;
			
			if(this.coordinates.rBuffer[i] > 0 && this.coordinates.rBuffer[i] < 360) {
				let bezier = 'cubic-bezier(.23,1,.32,1)';
				that.setTransform(arr[i - 1], rotate, 1000 + this.coordinates.delay, +this.coordinates.duration - 1000, bezier);
			}
			if(this.coordinates.rBuffer[i] > 359) {
				let bezier = 'cubic-bezier(.7, .16, .3, .84)';
				that.setTransform(arr[i - 1], rotate, this.coordinates.duration, this.coordinates.delay, bezier);
			}
		}
	};
	

	this.setTransform = (el, rotate, duration, delay, bezier) => {
		el.setAttribute('style', "transform: rotateX(" + rotate  + "deg);transition-duration:" + duration + "ms; transition-delay:" + delay + "ms;transition-timing-function:" + bezier);
	};

	this.getLog = (msg) => {
		var ot = log.scrollHeight - log.clientHeight;
		if (ot > 0) log.scrollTop = ot;
		return log.textContent += msg + "\n";
	};

	function randomInteger(min, max) {
	    let rand = min - 0.5 + Math.random() * (max - min + 1)
	    rand = Math.round(rand);
	    return rand;
	};

	return this;
};



function getDecimal(num) {
  var str = "" + num;
  var zeroPos = str.indexOf(".");
  if (zeroPos == -1) return 0;
  str = str.slice(zeroPos);
  return +str;
};

function rough(value, factor){
	if(isNaN(value/2)) return false;

	factor = factor || 1; 
	let res = Math.random() >= .5 ? value + (Math.random()*factor) : value - (Math.random()*factor);

	res = +(res).toFixed(2);
	return res;
};

function createArray(arg) {
	if(!arg)
		arg = 0;
	var str = "" + (arg).toFixed(2), string = "";
  	for(var i = 0; i < str.length; i++){
    	//if(i == 0 && +str[i] == 0) continue; 
    	if(!isNaN(+str[i])) string += str[i];
    }
	arg = string.split("");
	return arg;
};


function randomInteger(min, max) {
    rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};