'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  describe('home page', function() {
    beforeEach(function() {
      browser.get('/#/home');
    })

    it('home should show up for #/home', function() {
      expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/home");
    });

    it('clicking buy should take you to the cart', function() {
      var buyButton = element(by.id("buyOnlineLink"));
      buyButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/cart")
    })

    it('clicking the pick up link should keep you on home', function() {
      var pickupButton = element(by.id("pickupLink"));
      pickupButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/cart");
    })

    it('clicking a giftcard should take you to that giftcard page', function() {
      var pickupButton = element(by.id("amazon"));
      pickupButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/cards/amazon");
    });

    it('gift card names with spaces should be concatenated', function() {
      var pickupButton = element(by.id("amctheatres"));
      pickupButton.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/cards/amctheatres");
    });
  });
});
