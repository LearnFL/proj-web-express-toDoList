function getDate() {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    // year: "numeric"
  };

  var day = today.toLocaleDateString("en-US", options);
  return day
}

module.exports.getDate = getDate;

//OR
//exports.getDate = getDate;
