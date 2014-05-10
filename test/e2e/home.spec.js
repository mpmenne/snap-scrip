'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  describe('home page', function() {
    beforeEach(function() {
      browser.get('/#/home');
    })

    it('home should show up for #/home', function() {
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/home");
    });

    it('clicking a giftcard should take you to that giftcard page', function() {
      var pickupButton = element(by.id("amazon"));
      pickupButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/cards/amazon");
    });

    it('gift card names with spaces should be concatenated', function() {
      var pickupButton = element(by.id("amctheatres"));
      pickupButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/cards/amctheatres");
    });
  });
});
