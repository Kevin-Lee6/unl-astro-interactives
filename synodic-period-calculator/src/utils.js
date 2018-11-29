/*
This function check if the value is a positive demical. Return true if it is, else return false.
*/
const validate = function(n) {
  var numString = n.toString();
  var pattern = /^[0-9]+(\.[0-9]{1,2})?$/;
  if (numString.match(pattern) == null) {
    return false;
  }
  return true;
};

const roundToTwoPlace = function(n) {
  return Math.round(n * 100) / 100;
};

export { validate, roundToTwoPlace };
