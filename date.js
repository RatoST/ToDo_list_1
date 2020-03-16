//jshint esversion:6

// export function without () as when there are () its exports current status and without () its exports function to be called from another file
exports.getDate = function () {

  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  return today.toLocaleDateString("en-US", options);

};

exports.getDay = function () {

  const today = new Date();

  const options = {
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);

};
