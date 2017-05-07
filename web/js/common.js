function makeCounter() {
  var currentCount = 12345;
  var currentCountString = currentCount.toString(10);
  console.log(currentCountString);

  // возвращаемся к функции
  function counter() {
	  return currentCount++;
	}

  // ...и добавляем ей методы!
  counter.set = function(value) {
	currentCount = value;
  };

  counter.reset = function() {
	currentCount = 1;
  };

  return counter;
}

var counter = makeCounter();