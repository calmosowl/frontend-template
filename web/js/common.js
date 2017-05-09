function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    data = rand;
    return data;
}

// var obj = { 1 : countArray };
// var sObj = JSON.stringify(obj)
// localStorage.setItem("object", sObj);
//✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪
//✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪

var data = 123;
var arr = [];
function countToArray(data) {
	string = data.toString(10);
	var i = 0;
	while(string.length < 5) {
		string = "0" + string;
		i++;
	}
	dataArray = string.split("");
	arr.push(dataArray);
	return arr;
};

var i = 0;
while(i<3) {
	randomInteger(0, 99999);
	countToArray(data);
	i++;
}

console.log(arr);
var arrLength = arr.length;
function Δ () {
	firstArr = arr[arrLength - 2];
	lastArr = arr[arrLength - 1];

}



// function makeCounter() {
//   var currentCount = 12345;
//   var arrayCount;

//   var newCount =  12348;
//   var Δ = 0;


//   function counter() {
// 	  return currentCount;
// 	}

//   counter.array = function(value) {
// 	string = value.toString(10);
//   	currentCount = string.split("").map(Number);
//   };

//   counter.set = function(value) {
// 	currentCount = value;
//   };

//   counter.reset = function() {
// 	currentCount = 1;
//   };

//   return counter;
// }

// var counter = makeCounter();