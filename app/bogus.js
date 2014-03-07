var app = angular.module("bogusApp", []);

app.controller("AppCtrl", function ($q, $timeout) {
  console.log('start');
  var one = $q.defer();
  var two = $q.defer();
  var three = $q.defer();

  var all = $q.all([one.promise, two.promise, three.promise]);
  all.then(success);

  function success(data) {
    console.log(data);
  }
  one.promise.then(success);
  two.promise.then(success);
  three.promise.then(success);

  $timeout(function () {
    one.resolve("one done");
    console.log("one completed");
  }, Math.random() * 1000);

  $timeout(function () {
    two.resolve("two done");
    console.log("two completed");
  }, Math.random() * 1000);

  $timeout(function () {
    three.resolve("three done");
    console.log("three completed");
  }, Math.random() * 1000);
})