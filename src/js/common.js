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
	var string = arg.toString(10);
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


//****************************************//
/*"use strict";
document.addEventListener("DOMContentLoaded", (ev) => {
  (()=>{*/
var rollerSeven = document.getElementById('rollerSeven'),
  test = document.getElementById('test');

function findKeyframesRule(rule)
    {
        // gather all stylesheets into an array
        var ss = document.styleSheets;
        
        // loop through the stylesheets
        for (var i = 0; i < ss.length; ++i) {
            
            // loop through all the rules
            //document.styleSheets[0].rules[42].cssText
            for (var j = 0; j < ss[i].rules.length; ++j) {
                
                // find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
                if (ss[i].rules[j].type == 7 && ss[i].rules[j].name == rule)
                    return ss[i].rules[j].cssRules;
            }
        }
        
        // rule not found
        return null;
    }
// remove old keyframes and add new ones
function change(anim, el)
    {
        // find our -webkit-keyframe rule
        var keyframes = findKeyframesRule("spin");
        
        // remove the existing 0% and 100% rules
        keyframes.deleteRule("0%");
        keyframes.deleteRule("100%");
        
        // create new 0% and 100% rules with random numbers
        keyframes.appendRule("0% { -webkit-transform: rotate("+randomFromTo(-360,360)+"deg); }");
        keyframes.appendRule("100% { -webkit-transform: rotate("+randomFromTo(-360,360)+"deg); }");
        
        // assign the animation to our element (which will cause the animation to run)
        el.style.webkitAnimationName = "spin";
    }


function startChange(el)
    {
        // remove the old animation from our object
        el.style.webkitAnimationName = "none";
        
        // call the change method, which will update the keyframe animation
        setTimeout(function(){change("rotate", rollerSeven);}, 0);
    }
test.onclick= (ev) => {
      ev.preventDefault();
      startChange(rollerSeven);
    };

var keyframes = findKeyframesRule("spin");
// Makes an array of the current percent values
// in the animation
var keyframeString = [];  
for(var i = 0; i < keyframes.length; i++)
{
  keyframeString.push(keyframes[i].keyText); 
}
  
// Removes all the % values from the array so
// the getClosest function can perform calculations
var keys = keyframeString.map(function(str) {
  return str.replace('%', '');
});




/*  })();
}, false);*/

function Counter() {
  this.sum = 0;
  this.count = 0;
}

Counter.prototype.add = function(array) {
  array.forEach(function(entry) {
  this.sum += entry;
  ++this.count;
  }, this);
  // ^---- Note
};

var obj = new Counter();
obj.add([2, 5, 9, 10]);
obj.count;
// 3 
obj.sum




/* ++++ */
  this.turn = (el, val, interval, rotate) => {
    if(val > 0) {
      el.setAttribute('style', "transform: rotateX(" + (+rotate - val * 36) + "deg);transition-duration:" + interval + "ms;transition-delay: " + 0 + "ms;");
      
      var timerId = setTimeout(this.turn, interval, el, val - 1, interval, rotate);
      console.log("\nDate: " + Date.now() + " val: " + val + " interval: " + interval + " rotate: " + rotate);
    }
    //if(val == 0) clearTimeout(timerId);
  }
/* ++++ */