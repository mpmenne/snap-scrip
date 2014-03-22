'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('app/index.html');
  });


  describe('home page', function() {
    beforeEach(function() {
      browser.navigateTo('app/index.html/#/home')
    })

    it('home should show up for #/home', function() {
      expect(browser().location().url()).toBe("/#/home");
    });
  });




  describe('view1', function() {

    beforeEach(function() {
      browser().navigateTo('#/view1');
    });


    xit('should render view1 when user navigates to /view1', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser().navigateTo('#/view2');
    });


    xit('should render view2 when user navigates to /view2', function() {
      expect(element('[ng-view] p:first').text()).
        toMatch(/partial for view 2/);
    });

  });
});
