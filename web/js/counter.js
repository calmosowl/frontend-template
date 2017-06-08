"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
	(()=>{
		let a = new JackPotCounter({
			tickLength: 5000,
			qtyPerTick: 10,
		});
		
		let output = document.getElementById('output'),
			play = document.getElementById('tickPlay'),
			stop = document.getElementById('tickStop'),
			submit = document.getElementById('submitData'),
			log = document.getElementById('log'),
			input = document.getElementById('dataVal'),			
			rollerOne = document.getElementById('rollerOne'), 
			rollerTwo = document.getElementById('rollerTwo'), 
			rollerThree = document.getElementById('rollerThree'), 
			rollerFour = document.getElementById('rollerFour'), 
			rollerFive = document.getElementById('rollerFive'), 
			rollerSix = document.getElementById('rollerSix'), 
			rollerSeven = document.getElementById('rollerSeven');
	
		a.elemArr = [rollerOne, rollerTwo, rollerThree, rollerFour, rollerFive, rollerSix, rollerSeven];

		play.onclick= (ev) => {
			ev.preventDefault();
				a.tickPlay().echo(output);
		};

		stop.onclick= (ev) => {
			ev.preventDefault();
			a.tickStop().echoStop();			
		};

		submit.onclick = (ev) => {
			ev.preventDefault();
			a.setCurrentValue(input.value);
			a.getLog("\n⮡ " + a.currentValue + " 🢣🢣🢣🢣🢣🢣🢣");
			a.tickPlay().echo(output);
		};
		input.onkeydown = (ev) => {
			if(ev.keyCode == 13){
				a.setCurrentValue(input.value);
				a.getLog("\n⮡ " + a.currentValue + " 🢣🢣🢣🢣🢣🢣🢣");
				a.tickPlay().echo(output);
			}
		};

	})();
}, false);



function JackPotCounter(options){
	let that = this;
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
		speed: [],
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
				/*emu*///this.currentValue = this.currentValue + randomInteger(0, 50);
				/*🕙*/
				if(+this.data.diffBetweenLatests > 0) {
					this.timeBuffer.splice(0, 0, this.data.time);
					this.timeBuffer.length = 10;
					this.data.duration = this.timeBuffer[1] > 0 ? this.timeBuffer[0]-this.timeBuffer[1] : this.tickLength;
					this.coordinates.time = this.timeBuffer.join(', ');
					this.transform(this.elemArr);

					this.getLog("\n⮡ " + this.currentValue + " 🢣🢣🢣🢣🢣🢣🢣");
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

	this.dev = () => {
		console.log(this.coordinates);
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

	this.getDiff = () => {
		return this.data.diffBetweenLatests;
	};

	this.transform = (elemArr) => {
		var arr = elemArr.slice(),
			data = that.currentValue * 100;
		for(var i = 7; i >= 0; i--) {
			var multiplier = parseInt(data / Math.pow(10, 7 - i)),
				rotate = multiplier * 36;
			if(i == 7) {
				this.coordinates.rotate.splice(0, 0, rotate);
				let dRotate = this.coordinates.rotate[0]-this.coordinates.rotate[1];
				console.log(dRotate);
				this.coordinates.speed.splice(0, 0, parseInt((dRotate/(this.tickLength/1000))));
				this.coordinates.speed.length = 4;
				this.coordinates.speedAverage = this.coordinates.speed.reduce(function(sum, current) {return parseInt(sum + current)}) / this.coordinates.speed.length;	
				this.coordinates.deviation = (Math.sqrt(this.coordinates.speed.reduce(function(a, b) {
					var dev = b - that.coordinates.speedAverage;
					return a+dev*dev;
				})/this.coordinates.speed.length))/1000;

				this.coordinates.duration = this.coordinates.deviation > 4 ? 
											parseInt(dRotate / this.coordinates.speedAverage * 1000) :	
											this.tickLength;

			}
			if(rotate > 0) that.setTransform(arr[i - 1], rotate, this.coordinates.duration);
		}
	};

	this.setTransform = (el, rotate, duration) => {
		var 
			oldrotate = +el.getAttribute("data-rotate"),
			newrotate = rotate - oldrotate;
			el.setAttribute('style', "transform: rotateX(" + rotate  + "deg);transition-duration:" + duration + "ms;");
			el.setAttribute("data-rotate", newrotate); 
			el.setAttribute("data-duration", duration); 
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