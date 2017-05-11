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

// ********************
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
    elemArr.forEach(function(item, i, elemArr) {
		moveCell(item, prevArr[i]*(-20));
	});
    setTimeout(generator, 5000);
}

var cellOne = document.querySelector("#cell-1"),
	cellTwo = document.querySelector("#cell-2"),
	cellThree = document.querySelector("#cell-3"),
	cellFour = document.querySelector("#cell-4"),
	cellFive = document.querySelector("#cell-5");

var transform = window.getComputedStyle(
	document.querySelector('#cell-5'), ':before'
).getPropertyValue('transform');

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
	moveCell(item, prevArr[i]*(-20));
});

generator();
});