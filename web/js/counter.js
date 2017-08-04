"use strict";
function WidgetTopPanel(options){
	let that = this;
	this.elem = options.container;
	this.left = options&&options.left ? options.left : '';
	this.right = options&&options.right ? options.right : '';
	this.counters = options&&options.counters ? options.counters : '{}';

	this.jsonData = JSON.parse(that.counters);
	
	let elem;
	this.init = () => {
    	if ( !that.elem || !document.getElementById(that.elem) ) {
    		console.warn('Container not defined or missing in document');
    		return false;
    	} 
    	that.renderItems();
    	slider(0);
  	}

  	this.render = () => {
	    elem = document.createElement('div');
		elem.className = that.elem;
		document.body.appendChild(elem);
	}

	this.renderItems = () => {	
		elem = document.getElementById(that.elem);
		let innerElem = document.createElement('div');
			elem.appendChild(innerElem);
			innerElem.className = "jptb-top-panel";
		let leftItem = document.createElement('div');
			innerElem.appendChild(leftItem);
			leftItem.className = "jptb-left";
			leftItem.textContent = that.left;

		let centerItem = document.createElement('div');
			innerElem.appendChild(centerItem);
			centerItem.className = "jptb-center";

		let rightItem = document.createElement('div');
			innerElem.appendChild(rightItem);
			rightItem.className = "jptb-right";
			rightItem.textContent = that.right;

		if (document.querySelector('.jptb-center')){
			that.renderCounters();
		} 
	}

	/* counters generator */

	this.counterBuffer = new Map();

	this.renderCounters = () => {
		for (var counter in that.jsonData) {
			let id = that.jsonData[counter].id ? that.jsonData[counter].id : false;
			if(id)
			that.counterBuffer.set(that.jsonData[counter].id, new JackPotCounter(that.jsonData[counter]));
		}
	}

	this.update = (json) => {
		let jsonData = JSON.parse(json);

		for (var counter in jsonData) {
			let id = jsonData[counter].id ? jsonData[counter].id : false;
			let amount = jsonData[counter].amount ? jsonData[counter].amount : false;
			let action = jsonData[counter].action ? jsonData[counter].action : false;
			
			console.log("\n" + "has(id): " + that.counterBuffer.has(id));

			if(id && !that.counterBuffer.has(id))
				that.counterBuffer.set(jsonData[counter].id, new JackPotCounter(jsonData[counter]));
			if(id && amount && amount > that.counterBuffer.get(id).currentValue)
				that.counterBuffer.get(id).setCurrentValue(amount);
				that.counterBuffer.get(id).run();
			if(id && action) {	
				that.counterBuffer.get(id).actionPlay(action);
			}
		}
		console.log('counterBuffer:');console.log(that.counterBuffer);		
	}

	// 🔚 

	/* slider */
	let parent;
	let slider = (y) => {
		parent = document.querySelector('.jptb-center');
		let widgetHeight = parent.clientHeight;
		let	arr = Array.from(document.querySelectorAll('.jptb-jackpot-item')),
				parentWidth = parent.clientWidth,
				itemsWidth = arr.reduce(function(sum, current) {
					return sum + current.clientWidth;
				}, 0);

		let scrollHeight = +parent.scrollHeight;
		if(itemsWidth > parent.clientWidth) {
			if (y < scrollHeight) {
				parent.style.transform = "translateY(-" + y + "px)";
				y += 40;
				setTimeout(slider, 8000, y);
			} else goDown(y - 40);
		}
	}

	function goDown(y) {
		if ( y > 0 ) {
			parent.style.transform = "translateY(-" + y + "px)";
			y += -40;
		setTimeout(goDown, 8000, y);	
		} else slider(0);
	}

	// 🔚 

	return this;
};


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
	this.action = options&&options.action ? options.action : '';
	this.currentValue = options&&options.amount ? options.amount : 0;
	this.id = options&&options.id ? options.id : 0;
	this.ticker = [];
	this.echoTicker = [];
	this.currency = options&&options.currency ? options.currency : '';
	this.jackName = options&&options.jackName ? options.jackName : '';
	this.jackOrder = parseInt(that.currentValue * (-1));
	this.numRolls = options&&options.numRolls ? options.numRolls : 7;
	this.elemArr = options&&options.elemArr ? options.elemArr : [];
	this.tickLength = options&&options.tickLength ? options.tickLength : 1000;
	
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
		this.sorting();
		return this;
	};

	this.show = () => {
		return {
      		value: this
    	}
	};

	this.sorting = elem => elem.style.order = that.jackOrder + '';
	

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

	/* actions */

	let eventText = newElem('div', {class: 'fadeIn aim'});
	this.win = () => {
		eventText.textContent = "WIN";
		append(eventText);
		//that.addClass(document.getElementById('jptb' + that.id), 'jptb-win');
	};

	this.hit = () => {
		eventText.textContent = "HIT";
		append(eventText);
	};
	this.delete = () => {
		eventText.textContent = "DEL";
		append(eventText);
	};

	this.actionPlay = (action) => {
		switch (action) {
			case "WIN":	that.win();
			break;
			
			case "HIT":	that.hit();
			break;
			
			case "DELETE":	that.delete();
			break;
		}
	}

	// 🔚 
	
	this.sorting = () => {
		let elem = document.getElementById('jptb' + that.id);
			elem.style.order = parseInt(-that.currentValue);
	}


	(this.drawOdometer = () => {
		let parent = document.querySelector('.jptb-center');
			let jackpotItem = document.createElement('div');
				jackpotItem.className = 'jptb-jackpot-item';
				jackpotItem.style.order = that.jackOrder + '';
				jackpotItem.id = "jptb" + that.id;
				if(options&&options.jackName){
					jackpotItem.innerHTML = "<div class='jptb-jackpot-name'>" + that.jackName + "</div>";
				} else jackpotItem.innerHTML = "<div class='jptb-jackpot-name'></div>";
					
			let jackpotCounter = document.createElement('div');
			jackpotCounter.className = 'jptb-jackpot-counter';
			
			let jackpotСurrency = document.createElement('div');
			jackpotСurrency.className = 'jptb-jackpot-currency';
			jackpotСurrency.textContent = this.currency;

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
		
		that.elemArr = Array.from(document.querySelectorAll('#jptb' + that.id + ' .jptb-roller'));
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


/* helpers */

function newElem(tag, params) {
    params = params || {};
    var elem = document.createElementNS ?
        document.createElementNS('http://www.w3.org/1999/xhtml', tag) :
        document.createElement(tag);

    for (var pr in params) {
        attr(elem, pr, params[pr]);
    }

    return elem;
}

function attr(el, at, value) {
    at = {
        'for': 'htmlFor',
        'class': 'className'
    }[at] || at;
    if (!value) {
        return el[at] || el.getAttribute(at) || '';
    } else {
        if (at == 'style') {
            el.style.cssText = value;
            return;
        }
        el[at] = value;
        if (el.setAttribute) el.setAttribute(at, value);
    }
}

function append(el, where) {
    (where || document.body).appendChild(el);
}

// 🔚