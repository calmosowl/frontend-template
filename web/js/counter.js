"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
	(()=>{
		let a = new JackPotCounter({
			tickLength: 5000,
			qtyPerTick: 10
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
	
		// a.elemArr = [rollerSeven, rollerSix, rollerFive, rollerFour, rollerThree, rollerTwo, rollerOne];
		a.elemArr = [rollerSeven, rollerSix];

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
				// this.pushRoll(this.elemArr);
			// this.animationPaused(this.elemArr);
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

	this.pushRoll = (elemArr) => {
		elemArr.forEach(function(el, i, elemArr) {
			var multi = Math.pow(10, i),
				s = that.currentValue * 10,
				rollSeries = ((s / multi).toFixed(3)).slice(0, -2), // Проверить округление. (995/10000).toFixed(3).slice(0, -2) = 0.1 . Округлило 0.09 
/* - 1000 */	duration = rollSeries > 1 ? ((that.tickLength - 1000)/ (rollSeries * 1).toFixed(0)) : that.tickLength - 1000;
			let newKey = ((getDecimal(+rollSeries)) * 10) + "";	
			el.classList.value = "";
			el.className += ' ' + "spin-" + newKey;
			

			if(+rollSeries <= 0) return this; 
			// el.style.WebkitAnimationName = "spin";
	  //   		el.style.animationName = "spin";
				el.style.WebkitAnimationDuration = duration + "ms";
	    		el.style.animationDuration = duration + "ms";
	    		
			    el.style.WebkitAnimationIterationCount = rollSeries;
	    		el.style.animationIterationCount = rollSeries;

				el.style.WebkitAnimationPlayState = "running";
				el.style.animationPlayState = "running";

	    		console.log(i + ":====\nrollSeries: " + rollSeries + "\nduration: " + duration + "\nnewKey =>" + newKey + "\nadd.class: " + el.classList);
	    	});
		return this;
	};

	this.animationPaused = (elemArr) => { 
		elemArr.forEach(function(el, i, elemArr) {

				
				el.style.WebkitAnimationPlayState = "paused";
				el.style.animationPlayState = "paused";
				console.log(el.classList);

			// el.style.animationName;
			// el.style.animationIterationCount;
			// el.style.animationPlayState;
			// el.style.animationDuration;
   		});
	};

	this.transform = (elemArr) => {
		elemArr.forEach(function(el, i, elemArr) {
			var multi = Math.pow(10, i),
				s = that.currentValue * 10,
				rotate = (((s / multi).toFixed(3)).slice(0, -2))-12, // Проверить округление. (995/10000).toFixed(3).slice(0, -2) = 0.1 . Округлило 0.09 
/* - 1000 */	duration = rotate > 1 ? ((that.tickLength - 1000)/ (rotate * 1).toFixed(0)) : that.tickLength - 1000;
			
			if(+rotate <= 0) return this;
			that.setTransform(el, rotate, duration);
	});
}
	this.setTransform = (el, rotate, duration) => {
			var x = el.setAttribute('style', "transform: rotateX(-" + rotate + "deg);transition-duration:" + duration + "ms;");
			that.getLog("id" + el.getAttribute('id') + "🚂🚃🚃🚃🚃🚃🚃🚃🚃🚃\n" + "rotate: " + rotate + "\nduration: " + duration);
		}
	this.getRotate = (el) => {
		var y = el.getAttribute('style');
		that.getLog(y);
	}   

	this.getLog = (msg) => {
		var ot = log.scrollHeight - log.clientHeight;
		if (ot > 0) log.scrollTop = ot;
		return log.textContent += msg + "\n";
	}

	return this;
};

function getDecimal(num) {
  var str = "" + num;
  var zeroPos = str.indexOf(".");
  if (zeroPos == -1) return 0;
  str = str.slice(zeroPos);
  return +str;
}

function rough(value, factor){
	if(isNaN(value/2)) return false;

	factor = factor || 1; 
	let res = Math.random() >= .5 ? value + (Math.random()*factor) : value - (Math.random()*factor);

	res = +(res).toFixed(2);
	return res;
};