"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
	(()=>{
		let a = new JackPotCounter({
			tickLength: 10000,
			qtyPerTick: 10,
			currentValue: 10
		});
		
		let output = document.getElementById('output'),
			play = document.getElementById('tickPlay'),
			stop = document.getElementById('tickStop'),
			move = document.getElementById('rollMove'),
			get = document.getElementById('getValue');
			
		var	rollerOne = document.getElementById('rollerOne'), 
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

		get.onclick = (ev) => {
			ev.preventDefault();
			alert(a.getCurrentValue());
		}




		move.onclick= (ev) => {
			ev.preventDefault();
			a.pushRoll(a.elemArr);
		};

		

	})();
}, false);



function JackPotCounter(options){
	let that = this;
	let bufferPrototype = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.buffer = bufferPrototype;
	this.data = {
		latest:0,
		diffBetweenLatests:0,
		groupAverage: 0,
		time: 0
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
				this.data.latest = this.currentValue;
				this.data.diffBetweenLatests = +(this.buffer[0]-this.buffer[1]).toFixed(2);
				this.data.groupAverage = +(this.buffer[this.buffer.length-1] / this.buffer.length).toFixed(2);
				this.data.time = Date.now();
				this.data.arrayStamp = this.buffer.join(', ');
				this.currentValue = rough(+(this.currentValue + this.qtyPerTick).toFixed(2));
				this.dev();
				this.transform(this.elemArr);
			}, this.tickLength);
		};
		return this;
	};
	this.dev = () => {
		console.log(this.data);
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

	this.getDiff = () => {
		return this.data.diffBetweenLatests;
	};

	this.transform = (elemArr) => {
		var arr = elemArr.slice();
		console.log(arr);
		var data = that.currentValue * 100;
		for(var i = 7; i >= 0; i--) {
			var multiplier = parseInt(data / Math.pow(10, 7 - i));
			var rotate = multiplier * 36;

			that.getLog("\n × " + i + "\n");
			if(rotate > 0) that.setTransform(arr[i - 1], rotate, that.tickLength - 1000);
			that.getLog(" ♻ " + rotate/36);
		}
	};

	this.setTransform = (el, rotate, duration) => {
		var 
			oldrotate = +el.getAttribute("data-rotate"),
			newrotate = rotate - oldrotate;
			el.setAttribute('style', "transform: rotateX(" + rotate  + "deg);transition-duration:" + duration + "ms;");
			el.setAttribute("data-rotate", newrotate); 
			el.setAttribute("data-duration", duration); 
			that.getLog(" ∡ " + rotate + "° - " + oldrotate + "° = " + newrotate + "° \n 🕙 " + duration);
	};

	this.getRotate = (el) => {
		var y = el.getAttribute('style');
		that.getLog(y);
	}   

	this.getLog = (msg) => {
		var ot = log.scrollHeight - log.clientHeight;
		if (ot > 0) log.scrollTop = ot;
		return log.textContent += msg + "\n";
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