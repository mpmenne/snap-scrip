'use strict';

describe('cart page', function() {

  beforeEach(function() {
    browser.get('/#/cards/amazon');
  })

  it('adding a card should put it in the cart', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    browser.get('/#/cart');
    var giftCardCount = element(by.id('giftCardCount'));
  });

});