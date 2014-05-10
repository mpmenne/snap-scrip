'use strict';

/* jasmine specs for services go here */

describe('services', function() {
  var CardService;
  var PdfService;
  var $httpBackend;
  var CartService;
  var $filter;
  var OrderService;

  beforeEach(module('snapscripApp_controllers'));
  beforeEach(module('snapscripApp_services'));
  beforeEach(module('snapscripApp_filters'));
  beforeEach(inject(function(_CardService_, _PdfService_, _$httpBackend_, _CartService_, _$filter_, _OrderService_) {
    CardService = _CardService_;
    PdfService = _PdfService_;
    $httpBackend = _$httpBackend_;
    OrderService = _OrderService_;
    $httpBackend.expectGET('rest/cards.json').
        respond([{"name":"Amazon", "path": "img/amazon-giftcard.jpg", "logo": "img/amazon-giftcard.jpg", "percentage": "4%", "values": ["25", "100"], "tags":"books, electronics, kindle"}]);
    CartService = _CartService_;
    $filter = _$filter_;
  }));

  describe('card service', function() {

    xit('should actually have the service', function() {
      expect(CardService).toBeTruthy();
    });

    xit('should return cards', function() {
      $httpBackend.flush();
      expect(CardService.allCards()).toBeTruthy();
    })

    xit('all cards should have a name', function() {
      $httpBackend.flush();
      var cards=CardService.allCards().length;
      for(var card in cards) {
        expect(card.name).toBeTruthy();
        expect(card.path).toBeTruthy();
        expect(card.logo).toBeTruthy();
        expect(card.percentage).toBeTruthy();
      }
    });

    xit('should allow us to search for a specific card', function() {
      var card;
      $httpBackend.flush();
      CardService.findCard('Amazon').promise.then(function(data){
        expect(data.path).toBeTruthy();
      });
      CardService.findCard('Amazon1').promise.then(function(data){
        expect(data.path).toBeTruthy();
      });
    });
    xit('should allow us to search for url friendly names', function() {
      $httpBackend.flush();
      CardService.findCard('amazon').promise.then(function(data){
        expect(data.path).toBeTruthy();
      });
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
      CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      expect(CartService.allCartItems()).toEqual([{ name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}]);
      expect(CartService.allCartItems().length).toEqual(1);
    });
    it ('should be able to handle multiple gift cards', function() {
      CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      CartService.addItemToCart( { name:'Best Buy', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      expect(CartService.allCartItems().length).toEqual(2);
    });
    it ('should have no giftcards after clear', function() {
      CartService.addItemToCart( { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      CartService.addItemToCart( { name:'Best Buy', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      CartService.clearCart();
      expect(CartService.allCartItems().length).toEqual(0);
    });
    it('should let us remove giftcards', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4};
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
    it('values stored as a string should still work as a number', function() {
      var giftcard = { name:'Amazon', value:'50', logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, '50');
      expect(CartService.cardCount('Amazon', 50)).toBe(1);
    });

    it('clear cart should wipe out everything in the cart', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, 50);
      CartService.addItemToCart(giftcard1, 50);
      CartService.clearCart();
      expect(CartService.allCartItems().length).toBe(0);
    });
    it('should let us see how many of each gift card we have', function(){
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, 50);
      CartService.addItemToCart(giftcard1, 50);
      expect(CartService.cardCount('Amazon',50)).toBe(2);
    });
    it('cardCount should take into account the value of the giftcard', function(){
      var giftcard = { name:'Amazon', value:25, logo:'/logo', path:'/path', percentage:'4'};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:'4'};
      CartService.addItemToCart(giftcard, 25);
      CartService.addItemToCart(giftcard1, 50);
      expect(CartService.cardCount('Amazon',50)).toBe(1);
      expect(CartService.cardCount('Amazon',25)).toBe(1);
    });
    it('cardCount should still work with string values', function(){
      var giftcard = { name:'Amazon', value:25, logo:'/logo', path:'/path', percentage:4};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4};
      CartService.addItemToCart(giftcard, 25);
      CartService.addItemToCart(giftcard1, 50);
      expect(CartService.cardCount('Amazon','50')).toBe(1);
      expect(CartService.cardCount('Amazon','25')).toBe(1);
    });
    it('should let us clear out a certain type of card', function() {
      var giftcard = { name:'Amazon', value:'50', logo:'/logo', path:'/path', percentage:4};
      var giftcard1 = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4};
      CartService.addItemToCart(giftcard, 50);
      CartService.addItemToCart(giftcard1, '50');
      expect(CartService.cardCount('Amazon',50)).toBe(2);
      CartService.clearCards('Amazon','50');
      expect(CartService.cardCount('Amazon',50)).toBe(0);
    });
    it('we can add a transaction fee to a cart', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4};
      CartService.addItemToCart({ name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      CartService.addTransactionFee('Electronic Check Fee', 1.5);
      expect(CartService.allCartItems().length).toBe(2);
    });
    it('we can only have one transaction fee on a cart', function() {
      var giftcard = { name:'Amazon', value:50, logo:'/logo', path:'/path', type:'fee', percentage:4};
      CartService.addItemToCart(giftcard, 50);
      CartService.addTransactionFee('Electronic Check Fee', 1.5);
      CartService.addTransactionFee('Credit Card Fee', 1.5);
      CartService.addTransactionFee('Electronic Check Fee', 1.5);
      expect(CartService.allCartItems().length).toBe(2);
    });
    it('cart can tell us the total value of all items', function() {
      CartService.addItemToCart({ name:'Amazon', value:50, logo:'/logo', path:'/path', percentage:4}, 50);
      CartService.addItemToCart({ name:'Amazon', value:25, logo:'/logo', path:'/path', percentage:4}, 25);
      CartService.addItemToCart({ name:'Amazon', value:100, logo:'/logo', path:'/path', percentage:4}, 100);
      CartService.addTransactionFee('Electronic Check Fee', 1.5);
      expect(CartService.totalCartAmount()).toBe(176.5);
    })
  });

  describe('PdfService', function() {
    it('PdfService should be injected', function() {
      expect(PdfService).toBeDefined();
    });
  });

  describe('OrderService', function() {
    it('should be injected', function() {
      expect(OrderService).toBeDefined();
    });
    it('every saved order should have a unique ID', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, []);
      expect(uniqueKey).toBeDefined();
      expect(uniqueKey).toBeTruthy();
    });
    it('saved unique ID should contain name', function() {
      var uniqueKey = OrderService.save({firstName: 'Megan', lastName:'Menne', phone:'314 477 1111'}, []);
      expect(uniqueKey).toContain('menne');
      expect(uniqueKey).toContain('megan');
    })
    it('saved unique ID should not have any spaces', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, []);
      expect(uniqueKey).not.toContain(' ');
    });

    it('should add orders personal information (i.e. name, phone)', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, []);
      expect(OrderService.getOrder(uniqueKey).orderInformation.name).toEqual('Megan Menne');
      expect(OrderService.getOrder(uniqueKey).orderInformation.phone).toEqual('314 477 1111');
    });
    it('should have information on what was ordered', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, [{'name':'Amazon', 'total':50, 'count':2}]);
      expect(OrderService.getOrder(uniqueKey).orders[0].name).toEqual('Amazon');
      expect(OrderService.getOrder(uniqueKey).orders[0].total).toBe(50);
      expect(OrderService.getOrder(uniqueKey).orders[0].count).toBe(2);
    });
    it('we should only be able to confirm an order once', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, [{'name':'Amazon', 'total':50, 'count':2}]);
      expect(OrderService.confirmOrder()).toBeDefined();
      expect(OrderService.confirmOrder()).toEqual(false);
    });
    it('we can get the most recent order as much as we want', function(){
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111'}, [{'name':'Amazon', 'total':50, 'count':2}]);
      var currentOrder = OrderService.getOrder(uniqueKey);
      expect(currentOrder.orderInformation).toEqual({name: 'Megan Menne', phone:'314 477 1111'});
      expect(currentOrder.orders).toEqual([{'name':'Amazon', 'total':50, 'count':2}]);
    });
    it('should save how the cards will be picked up', function() {
      var uniqueKey = OrderService.save({name: 'Megan Menne', phone:'314 477 1111', 'rectoryPickup':true, 'afterMass':true,
        'sendHome':true, 'homeroom':'1st', 'childName':'laura'}, [{'name':'Amazon', 'total':50, 'count':2}]);
      var currentOrder = OrderService.getOrder(uniqueKey);
      expect(currentOrder.orderInformation.rectoryPickup).toBeTruthy();
      expect(currentOrder.orderInformation.afterMass).toBeTruthy();
      expect(currentOrder.orderInformation.sendHome).toBeTruthy();
      expect(currentOrder.orderInformation.homeroom).toBeTruthy();
      expect(currentOrder.orderInformation.childName).toBeTruthy();
    });
  });
});