var Promise = require('bluebird');

//var funcs = Promise.resolve([500, 100, 400, 200].map((n) => makeWait(n)));
var funcs = [500, 100, 400, 200].map(function(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //console.log(n);
      resolve(n);
      //return n;
    }, n);
  });
});

Promise.each(funcs, function(resp) {
    console.log(resp);
  })
  // funcs
  //   .each(iterator) // logs: 500, 100, 400, 200
  //   .then(console.log) // logs: [ [Function], [Function], [Function], [Function] ]
  // funcs
  //   .mapSeries(iterator)  // logs: 500, 100, 400, 200
  //   .then(console.log)    // logs: [500, 100, 400, 200]

// funcs
//   .map(iterator)        // logs: 100, 200, 400, 500
//   .then(console.log)    // logs: [500, 100, 400, 200]

// function iterator(f) {
//   return f()
// }

// function makeWait(time) {
//   return function () {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         console.log(time);
//         resolve(time);
//       }, time);
//     });
//   };
// }