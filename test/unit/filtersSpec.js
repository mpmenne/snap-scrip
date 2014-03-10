'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('snapscripApp_filters'));


  describe('deleted', function() {
    beforeEach(module(function($provide) {
    }));


    it('test deleted filter', inject(function(deletedFilter) {
      expect(deletedFilter([{'deleted':true}])).toEqual(true);
    }));
  });

});
