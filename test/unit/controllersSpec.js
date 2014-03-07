'use strict';

describe('controllers', function(){
  var $scope;
  var donationAggregate;
  var baseController;
  var $filter;
  var aggregateFilter;

  beforeEach(module('snapscripApp_controllers'));
  beforeEach(inject(function(_$rootScope_, $controller, _$filter_) {
    $scope = _$rootScope_.$new();
    baseController = $controller('BaseController', {$scope:$scope});
    $filter = _$filter_;
    aggregateFilter = $filter('donationAggregate')
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

})