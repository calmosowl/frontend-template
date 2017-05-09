var currentData = 120;
var previousData = 42;
var delta = currentData - previousData;

// делаем массив
var cellOne = document.querySelector("#cell-1"),
	cellTwo = document.querySelector("#cell-2"),
	cellThree = document.querySelector("#cell-3"),
	cellFour = document.querySelector("#cell-4"),
	cellFive = document.querySelector("#cell-5");

var arr = [];
function deltaToArray(delta) {
	if(!delta)
		delta = 0;
	string = delta.toString(10);
	var i = 0;
	while(string.length < 5) {
		string = "0" + string;
		i++;
	}
	arr = string.split("");
	return arr;
};

function moveCell(element, step) {
	element.style.transform = "matrix(1, 0, 0, 1, 0," + step + ")";
}

deltaToArray(delta);
console.log(arr);