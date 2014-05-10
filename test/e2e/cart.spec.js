'use strict';

describe('cart page', function() {

  beforeEach(function() {
    browser.get('/#/cards/amazon');
  })

  xit('adding a card should put it in the cart', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    browser.get('/#/cart');
    var giftCardCount = element(by.id('giftCardCount'));
    expect(giftCardCount.getText()).toBe('Giftcards 1');
  });

  xit('adding two cards should put both in the cart', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    addTwentyFiveButton.click();
    browser.get('/#/cart');
    var giftCardCount = element(by.id('giftCardCount'));
    expect(giftCardCount.getText()).toBe('Giftcards 2')
  });
});