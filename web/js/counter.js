"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
	(()=>{
		let a = new JackPotCounter({
			tickLength: 5000,
			qtyPerTick: 1
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
	
		a.elemArr = [rollerSeven, rollerSix, rollerFive, rollerFour, rollerThree, rollerTwo, rollerOne];

		play.onclick= (ev) => {
			ev.preventDefault();
				a.tickPlay().echo(output);
				// setInterval(() => {
				// 	ev.preventDefault();
				// 	a.pushRoll(elemArr);    
				// }, a.tickLength + 100);	
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
				this.animationPaused(this.elemArr);
				this.pushRoll(this.elemArr);
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
				s = that.data.diffBetweenLatests * 10,
				rollSeries = ((s / multi).toFixed(3)).slice(0, -2), // Проверить округление. (995/10000).toFixed(3).slice(0, -2) = 0.1 . Округлило 0.09 
				duration = rollSeries > 1 ? ((that.tickLength)/ (rollSeries * 1).toFixed(0)) : that.tickLength;

			if(+rollSeries <= 0) return this; 
				el.style.WebkitAnimationDuration = duration + "ms";
	    		el.style.animationDuration = duration + "ms";
				// el.style.WebkitAnimationPlayState = "running";
				// el.style.animationPlayState = "running";
	    		// console.info('running');
			    el.style.WebkitAnimationIterationCount = rollSeries;
	    		el.style.animationIterationCount = rollSeries;
	    		console.log(i + ": rollSeries: " + rollSeries + "\nduration: " + duration);
	    	});
		return this;
	};

	this.animationPaused = (elemArr) => { 
		elemArr.forEach(function(el, i, elemArr) {
	    			// el.style.WebkitAnimationPlayState = "paused";
					// el.style.animationPlayState = "paused";
	    			console.info('paused');
	    			el.style.WebkitAnimationPlayState = "running";
					el.style.animationPlayState = "running";
	    		});
	};
	return this;
};

function rough(value, factor){
	if(isNaN(value/2)) return false;

	factor = factor || 1; 
	let res = Math.random() >= .5 ? value + (Math.random()*factor) : value - (Math.random()*factor);

	res = +(res).toFixed(2);
	return res;
};