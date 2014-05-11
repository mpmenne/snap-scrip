'use strict';

describe('controllers', function(){
  var $scope;
  var donationAggregate;
  var baseController;
  var $filter;
  var aggregateFilter;
  var orderAggregate;
  var isStockedFilter;
  var $httpBackend;

  beforeEach(module('snapscripApp_controllers'));
  beforeEach(inject(function(_$rootScope_, $controller, _$filter_, _$httpBackend_) {
    $scope = _$rootScope_.$new();
    baseController = $controller('BaseController', {$scope:$scope});
    $filter = _$filter_;
    $httpBackend = _$httpBackend_;
    aggregateFilter = $filter('donationAggregate');
    orderAggregate = $filter('orderAggregate');
    isStockedFilter = $filter('isStockedFilter');
  }));

  it('should work right', function() {
    expect(true).toBe(true);
  });

  describe('base controller', function(){
    it('BaseController should exist', function() {
      expect(baseController).toBeDefined();
    });
  })

  describe('donationAggregateFilter', function() {

    it('donationAggregate should exist', function() {
      expect(aggregateFilter).toBeDefined();
    });

    it('empty list should give 0', function() {
      expect(aggregateFilter([])).toBeCloseTo(0, 2);
    });
    it('list of one five dollar donation @ 20% should be $1', function() {
      expect(aggregateFilter([{"value":5, "percentage":20}])).toBeCloseTo(1, 2);
    });
  });

  describe('orderAggregate filter', function() {
    it('orderAggregate should exist', function() {
      expect(orderAggregate).toBeDefined();
    });
    it('orderAggregate should return an empty list for no orders', function() {
      expect(orderAggregate([])).toEqual([]);
    });
    it('orderAggregate should list name, total, and count for each giftcard', function() {
      expect(orderAggregate([{key:'amazon', value:25}])).toEqual([{key:'amazon', total:25, count:1}]);
    });
    it('ordering multiple giftcards with the same name should affect count and values', function() {
      expect(orderAggregate([{key:'amazon', value:25}, {key:'amazon', value:25}])).toEqual([{key:'amazon', total:50, count:2}]);
      expect(orderAggregate([{key:'amazon', value:25}, {key:'amazon', value:25}, {key:'amazon', value:100}])).toEqual([{key:'amazon', total:150, count:3}]);
    });
    it('ordering different giftcards should give the total for each card', function() {
      expect(orderAggregate([{key:'amazon', value:25}, {key:'bestbuy', value:50}])).toEqual([{key:'amazon', total:25, count:1}, {key:'bestbuy', total:50, count:1}]);
    });
    it('ordering multiples of different giftcards should give the total for each card', function() {
      expect(orderAggregate([{key:'amazon', value:25}, {key:'bestbuy', value:50}, {key:'amazon', value:50}, {key:'bobevans', value:10}])).toEqual([{key:'amazon', total:75, count:2}, {key:'bestbuy', total:50, count:1}, {key:'bobevans', total:10, count:1}]);
    });
  });

  describe('isStocked filter', function() {

    beforeEach(inject(function() {
      $httpBackend.expectGET('/rest/form.json').
          respond([
            {"key":"amazon", "name":"Amazon", "instock":false},
            {"key":"bestbuy", "name":"Best Buy", "instock":true},
            {"key":"dierbergs", "name":"Dierbergs", "instock":true}
          ]);
    }));
    it('isStocked should exist', function() {
      expect(isStockedFilter).toBeDefined();
    });
    it('cards labeled as instock should return true', function() {
      $httpBackend.flush();
      expect(isStockedFilter('bestbuy')).toEqual(true);
    });
    it('cards labeled as not instock should return false', function() {
      console.log("The evil test!!!!!!!!!!!!!!!!");
      $httpBackend.flush();
      expect(isStockedFilter('amazon')).toEqual(false);
    });
    it('dierbergs should be instock', function() {
      console.log("The evil test!!!!!!!!!!!!!!!!");
      $httpBackend.flush();
      expect(isStockedFilter('dierbergs')).toEqual(true);
    });

  });

})