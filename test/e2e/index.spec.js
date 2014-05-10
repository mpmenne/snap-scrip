'use strict';

describe('cart page', function() {

  beforeEach(function() {
    browser.get('/#/cards/amazon');
  })

  it('adding a card should list it at the top', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    var giftCardCount = element(by.id('giftCardCountNumber'));
    expect(giftCardCount.getText()).toBe('1');
  });

  it('adding two cards should list two cards at the top', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    addTwentyFiveButton.click();
    var giftCardCount = element(by.id('giftCardCountNumber'));
    expect(giftCardCount.getText()).toBe('2')
  });

  it('adding two cards should list the value at the top', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    addTwentyFiveButton.click();
    var giftCardCount = element(by.id('giftCardValueNumber'));
    expect(giftCardCount.getText()).toBe('$50')
  });

  it('adding two cards should list the contribution at the top', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    addTwentyFiveButton.click();
    addTwentyFiveButton.click();
    var giftCardCount = element(by.id('giftCardContributionNumber'));
    expect(giftCardCount.getText()).toBe('$2.00')
  });

  it('clicking the card count at the top shows the cart screen', function() {
    var giftCardCount = element(by.id('giftCardCount'));
    giftCardCount.click();
    expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/cart");
  });
});