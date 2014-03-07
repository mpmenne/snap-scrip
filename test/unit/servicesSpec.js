'use strict';

/* jasmine specs for services go here */

describe('services', function() {
  var CardService;
  var PdfService;
  var $httpBackend;
  var CartService;
  var $filter;

  beforeEach(module('snapscripApp_services'));
  beforeEach(module('snapscripApp_filters'));
  beforeEach(inject(function(_CardService_, _PdfService_, _$httpBackend_, _CartService_, _$filter_) {
    CardService = _CardService_;
    PdfService = _PdfService_;
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('rest/cards.json').
        respond([{"name":"Amazon", "path": "img/amazon-10.jpg", "logo": "img/amazon.jpg", "percentage": "4%", "values": ["25", "100"], "tags":"books, electronics, kindle"}]);
    CartService = _CartService_;
    $filter = _$filter_;
  }));

  describe('card service', function() {

    it('should actually have the service', function() {
      expect(CardService).toBeTruthy();
    });

    it('should return cards', function() {
      $httpBackend.flush();
      expect(CardService.allCards()).toBeTruthy();
    })

    it('all cards should have a name', function() {
      $httpBackend.flush();
      var cards=CardService.allCards().length;
      for(var card in cards) {
        expect(card.name).toBeTruthy();
        expect(card.path).toBeTruthy();
        expect(card.logo).toBeTruthy();
        expect(card.percentage).toBeTruthy();
      }
    });

    it('should allow us to search for a specific card', function() {
      $httpBackend.flush();
      expect(CardService.findCard('Amazon').path).toBeTruthy();
      expect(CardService.findCard('Amazon1').path).toBeFalsy();
    });
  });

  describe('pdf service', function() {
    it ('the pdf service should exist', function() {
     expect(PdfService).toBeTruthy();
    });
  });

  describe('cart service', function() {
    it ('should exist', function() {
      expect(CartService).toBeTruthy();
    });
    it ('should be empty at first', function() {
      expect(CartService.allCartItems()).toEqual({});
    });
    it ('should have something in it after add', function() {
      expect(CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'}, 50));
      expect(CartService.allCartItems()).toEqual([{ name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'}]);
      expect(CartService.allCartItems().length).toEqual(1);
    });
    it ('should be able to handle multiple gift cards', function() {
      expect(CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'}, 50));
      expect(CartService.addItemToCart( { name:'Best Buy', value:50, logo:'/logo', path:'/path', percentage:'4'}, 50));
      expect(CartService.allCartItems().length).toEqual(2);
    });
    it ('should have no giftcards after clear', function() {
      expect(CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'}, 50));
      expect(CartService.addItemToCart( { name:'Best Buy', value:50, logo:'/logo', path:'/path', percentage:'4'}, 50));
      CartService.clearCart();
      expect(CartService.allCartItems().length).toEqual(0);
    });
    it('should let us remove giftcards', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart( giftcard, 50);
      CartService.removeItemFromCart(CartService.allCartItems()[0]);
      expect(CartService.allCartItems().length).toEqual(0);
    });
    it('remove should mark one item as deleted', function() {
      var giftcard = { name:' Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, 50);
      CartService.removeItemFromCart(giftcard);
      expect(giftcard.deleted).toBe(true);
    });
    it('clear cart should wipe out everything in the cart', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, 50);
      CartService.addItemToCart(giftcard1, 50);
      CartService.clearCart();
      expect(CartService.allCartItems().length).toBe(0);
    });
  });
});