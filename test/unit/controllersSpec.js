'use strict';

describe('controllers', function(){
  var $scope;
  var donationAggregate;
  var baseController;
  var $filter;
  var aggregateFilter;
  var orderAggregate;

  beforeEach(module('snapscripApp_controllers'));
  beforeEach(inject(function(_$rootScope_, $controller, _$filter_) {
    $scope = _$rootScope_.$new();
    baseController = $controller('BaseController', {$scope:$scope});
    $filter = _$filter_;
    aggregateFilter = $filter('donationAggregate');
    orderAggregate = $filter('orderAggregate');
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
      expect(orderAggregate([{name:'Amazon', value:25}])).toEqual([{name:'Amazon', total:25, count:1}]);
    });
    it('ordering multiple giftcards with the same name should affect count and values', function() {
      expect(orderAggregate([{name:'Amazon', value:25}, {name:'Amazon', value:25}])).toEqual([{name:'Amazon', total:50, count:2}]);
      expect(orderAggregate([{name:'Amazon', value:25}, {name:'Amazon', value:25}, {name:'Amazon', value:100}])).toEqual([{name:'Amazon', total:150, count:3}]);
    });
    it('ordering different giftcards should give the total for each card', function() {
      expect(orderAggregate([{name:'Amazon', value:25}, {name:'Best Buy', value:50}])).toEqual([{name:'Amazon', total:25, count:1}, {name:'Best Buy', total:50, count:1}]);
    });
    it('ordering multiples of different giftcards should give the total for each card', function() {
      expect(orderAggregate([{name:'Amazon', value:25}, {name:'Best Buy', value:50}, {name:'Amazon', value:50}, {name:'Bob Evans', value:10}])).toEqual([{name:'Amazon', total:75, count:2}, {name:'Best Buy', total:50, count:1}, {name:'Bob Evans', total:10, count:1}]);
    });
  });

})