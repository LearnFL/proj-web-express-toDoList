function getDate() {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  var day = today.toLocaleDateString("en-US", options);
  return day
}

function test() {
  console.log('THAT IS A TEST');
}

export {getDate, test};
