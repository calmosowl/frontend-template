function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}
ready(function () {

// *******watch*******
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

function randomInteger(min, max) {
    rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
//******************//

var countObject = {
	count: 0
};
var delta;
countObject.watch("count", function (id, oldval, newval) {
    console.log(oldval+' '+ newval);
    delta = newval - oldval;
    console.log(delta);
    return newval;
});

function generator() {
	randomInteger(1, 100);
    countObject.count += rand;
	prevArr = createArray(countObject.count);
	moveCell(cellHundredth, randomInteger(1, 9)*(-lineHeight));
    elemArr.forEach(function(item, i, elemArr) {
		moveCell(item, prevArr[i]*(-lineHeight));
	});
    setTimeout(generator, 5000);
}

var $ = document.querySelector.bind(document);

var cellOne = $(".jackpot-counter-cell:nth-child(1)"),
	cellTwo = $(".jackpot-counter-cell:nth-child(2)"),
	cellThree = $(".jackpot-counter-cell:nth-child(3)"),
	cellFour = $(".jackpot-counter-cell:nth-child(4)"),
	cellFive = $(".jackpot-counter-cell:nth-child(5)");
	cellSix = $(".jackpot-counter-cell:nth-child(7)");
	cellSeven = $(".jackpot-counter-cell:nth-child(8)");

var transform = window.getComputedStyle(
	cellFive, ':before'
).getPropertyValue('transform');

var lineHeight = parseInt(window.getComputedStyle(
	cellFive, ':before'
).getPropertyValue('line-height'));

var elemArr = [cellOne, cellTwo, cellThree, cellFour, cellFive];

var arr = [];
function createArray(arg) {
	if(!arg)
		arg = 0;
	string = arg.toString(10);
	while(string.length < 5)
		string = "0" + string;
	arg = string.split("");
	return arg;
};

var prevArr = createArray(countObject.count);
console.log(prevArr);


function moveCell(element, step) {
	element.style.transform = "matrix(1, 0, 0, 1, 0," + step + ")";
}

elemArr.forEach(function(item, i, elemArr) {
	moveCell(item, prevArr[i]*(-lineHeight));
});

//generator();
});