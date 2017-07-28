"use strict";
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
	this.win = false;
	this.ticker = [];
	this.echoTicker = [];
	this.left = options&&options.left ? options.left : '0.00 EUR';
	this.right = options&&options.right ? options.right : 'this game';
	this.jackName = options&&options.jackName ? options.jackName : 'new game';
	this.jackOrder = options&&options.jackOrder ? options.jackOrder : 0;
	this.numRolls = options&&options.numRolls ? options.numRolls : 7;
	this.elemArr = options&&options.elemArr ? options.elemArr : [];
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
			}, this.tickLength);

		};
		return this;
	};

	this.run = () => {
			this.transform(this.elemArr);
			this.buffer.splice(0, 0, this.currentValue);
			this.buffer.length = 10;
			return this;
		};

	this.setCurrentValue = (v) => {
		if(isNaN(v/2)) 
			return console.info('= waiting for integer =');
		return this.currentValue = v;
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
		for(var i = arr.length; i >= 0; i--) {
			var multiplier = parseInt(data / Math.pow(10, arr.length - i)),
				rotate = multiplier * ANGLE;
			if(i == arr.length) {that.controller(rotate);}

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
	
	this.save = item => localStorage.setItem(that, JSON.stringify(item));

	this.setTransform = (el, rotate, duration, delay, bezier) => {
		el.setAttribute('style', "transform: rotateX(" + rotate  + "deg);transition-duration:" + duration + "ms; transition-delay:" + delay + "ms;transition-timing-function:" + bezier);
	};

	this.winpanelAnimate = () => {
		//that.addClass(document.querySelector('.jptb-center'), 'jptb-win')
		that.addClass(document.querySelector("[name='" + that.jackName + "']"), 'jptb-win');
	};

	(this.drawOdometer = () => {
		let parent = document.querySelector('.jptb-center');
			let jackpotItem = document.createElement('div');
				jackpotItem.className = 'jptb-jackpot-item';
				jackpotItem.setAttribute('style', "order: " + that.jackOrder + ";");
				jackpotItem.setAttribute('name', that.jackName);
				jackpotItem.innerHTML = "<div class='jptb-jackpot-name'>" + that.jackName + "</div>";
			
			let jackpotCounter = document.createElement('div');
			jackpotCounter.className = 'jptb-jackpot-counter';
			
			let jackpotСurrency = document.createElement('div');
			jackpotСurrency.className = 'jptb-jackpot-currency';
			jackpotСurrency.textContent = '$';

		let drawingCells = "<div class='jptb-jackpot-counter-cell'><div class='jptb-roller' data-rotate='0' data-duration='5000' style='transform: rotateX(0deg);transition-duration:5000ms'><div class='jptb-plane jptb-figure0'>0</div><div class='jptb-plane jptb-figure1'>1</div><div class='jptb-plane jptb-figure2'>2</div><div class='jptb-plane jptb-figure3'>3</div><div class='jptb-plane jptb-figure4'>4</div><div class='jptb-plane jptb-figure5'>5</div><div class='jptb-plane jptb-figure6'>6</div><div class='jptb-plane jptb-figure7'>7</div><div class='jptb-plane jptb-figure8'>8</div><div class='jptb-plane jptb-figure9'>9</div></div></div>";
		let wrapper = document.createElement('div');
		wrapper.className = 'jptb-jackpot-counter-wrapper';
		let collection = '';
		for (let i = that.numRolls; i > 0; i--) collection += drawingCells;
		wrapper.innerHTML=collection;
		jackpotCounter.appendChild(wrapper);
		jackpotItem.appendChild(jackpotCounter);
		jackpotItem.appendChild(jackpotСurrency);
		parent.appendChild(jackpotItem);
		var nameSelector = document.getElementsByName(that.jackName);
		that.elemArr = Array.from(document.querySelectorAll("[name='" + that.jackName + "'] .jptb-roller"));
		that.run();
	})();


	this.addClass = (el, className) => {
		if (el.classList)	el.classList.add(className);
		else el.className += ' ' + className;
	}




	/*watch polyfill*/
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

      if (delete this[prop]) { 
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

if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
    enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop) {
      var val = this[prop];
      delete this[prop]; 
      this[prop] = val;
    }
  });
}

this.watch("this.currentValue", function (id, oldval, newval) {
    		return newval;
		});

	return this;
};