'use strict';


describe('card page', function() {

  beforeEach(function() {
    browser.get('/#/cards/Amazon');
  })

  it('the url should match the page header', function() {
    var pageHeader = element(by.id("cardHeader"));
    expect(pageHeader.getText()).toBe('Amazon');
  })

})