function randomInteger(min, max) {
    rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

// var obj = { 1 : countArray };
// var sObj = JSON.stringify(obj)
// localStorage.setItem("object", sObj);
//✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪
//✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪✪

var data = 0;
var count = 0;
	function generator() {
while (count < 5) {
	randomInteger(0, 99);
	data += rand;
	console.log(data);
	countToArray(data);
	console.log(arr);
	count++;
	}
}


var arr = [];
function countToArray(data) {
	if(!data)
		data = 0;
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

countToArray(data);
console.log(arr);
// function sendData(data) {
// 	var rand = 0;
// 	randomInteger(0, 999);
// 	console.log(rand);
// 	data += rand;
// 	countToArray(data);
// 	return data;
// }



Δarr = [];
var arrLength = arr.length;
function Δ() {
	if(arrLength < 2)
		firstArr = [0, 0, 0, 0, 0];
	else
		firstArr = arr[arrLength - 2];
	lastArr = arr[arrLength - 1];
	var i = 0;
	while(i < 5) {
		Δarr.push(lastArr[i] - firstArr[i]);
		i++;
	}
	return Δarr;
}


generator();







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
