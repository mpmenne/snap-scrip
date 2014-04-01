'use strict';


describe('card page', function() {

  beforeEach(function() {
    browser.get('/#/cards/amazon');
  })

  it('the url should match the page header', function() {
    var pageHeader = element(by.id("cardHeader"));
    expect(pageHeader.getText()).toBe('Amazon');
  });

  it('amazon card detail should show up as /#/cards/amazon', function() {
    expect(browser.getCurrentUrl()).toBe("http://localhost:8009/#/cards/amazon");
  });

  it('add $25 dollar giftcard to basket', function() {
    var addTwentyFiveButton = element(by.id("add25"));
    expect(addTwentyFiveButton.getText()).toBe("$25 GIFT CARD (0)");
    addTwentyFiveButton.click();
    expect(addTwentyFiveButton.getText()).toBe("$25 GIFT CARD (1)");
  });

  it('add $100 dollar giftcard to basket', function() {
    var addHundredDollarButton = element(by.id("add100"));
    expect(addHundredDollarButton.getText()).toBe("$100 GIFT CARD (0)");
    addHundredDollarButton.click();
    expect(addHundredDollarButton.getText()).toBe("$100 GIFT CARD (1)");
  });
})