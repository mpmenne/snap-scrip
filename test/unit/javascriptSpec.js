describe('this is helps me learn javascript', function() {

  describe('javascript arrays', function() {

    it('allows us to see how many elements are in an array', function() {
      expect([1,2,3].length).toBe(3);
    });

    it('splice returns the elements cut out', function() {
      expect([1,2,4].splice(2, 1)).toEqual([4])
    });

    it('splice modifies the array in place', function() {
      var original = [1,2,3,4,5];
      original.splice(2,2);
      expect(original).toEqual([1,2,5]);
    });

    it('indexOf can find the location of an item', function() {
      expect([1,2,3,4,5].indexOf(3)).toEqual(2);
      expect(['a', 'b', 'c', 'd'].indexOf('a')).toEqual(0);
      expect([true, false, true, true].indexOf(false)).toEqual(1);
      expect([true, false, true, true].indexOf(true)).toEqual(0);  //returns the first if duplicates!
    });

    it('does indexOf work with JSON', function() {
      var json1 = {name:'Amazon', value:50};
      var json2 = {name:'Home Depot', value:50};
      expect([json1, json2].length).toBe(2);
      expect([json1, json2].indexOf({name:'Amazon', value:50})).toBe(-1);
      expect([json1, json2].indexOf(json1)).toBe(0);
      expect([json1, json2].indexOf(json2)).toBe(1);
    });

    it('what happens to index after we remove', function() {
      var json1 = {name:'Amazon', value:50};
      var json2 = {name:'Home Depot', value:50};
      var jsonArray = [json1, json2];
      expect([json1, json2].indexOf(json2)).toBe(1);
      jsonArray.splice(0,1);
      expect(jsonArray.indexOf(json2)).toBe(0);
    });

  })
})