'use strict';

var snapscripApp = angular.module('snapscripApp_controllers', ['ui.router', 'snapscripApp_services']);

snapscripApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'ScripController'
      })
      .state('root', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'ScripController'
      })
      .state('selectedCard', {
        url: '/cards/:cardName',
        templateUrl: 'templates/cardDetail.html',
        resolve: {
          CardService: 'CardService',
          CartService: 'CartService',
          LocationService: 'LocationService',
          cardLookup: function(CardService, $stateParams) {
            return CardService.findCard($stateParams.cardName);
          }
        },
        controller: function($scope, $stateParams, cardLookup, CartService, LocationService) {
          $scope.card = cardLookup;
          $scope.addToCart = CartService.addItemToCart;
          $scope.viewCart = LocationService.cart;
          $scope.removeItemFromCart = CartService.removeItemFromCart;
        }
      })
      .state('cart', {
        url: '/cart',
        templateUrl: 'templates/cart.html',
        controller: 'CartController'
      })
      .state('order', {
        url: '/order',
        templateUrl: 'templates/orderOptions.html',
        resolve: {
          CartService: 'CartService'
        },
        controller: function($scope, CartService) {
          $scope.addCheckProcessing = CartService.addCheckProcessing;
        }
      })
      .state('billing', {
        url: '/billing',
        templateUrl: 'templates/billing.html',
        resolve: {
          CartService: 'CartService'
        },
        controller: function($scope, CartService) {
          $scope.allCartItems = CartService.allCartItems;
        }
      })
      .state('review', {
        url: '/review',
        templateUrl: 'templates/review.html',
        resolve: {
          CartService: 'CartService',
          PdfService: 'PdfService'
        },
        controller: function($scope, PdfService, CartService) {
          $scope.generatePdf = PdfService.getPdf;
          $scope.allCartItems = CartService.allCartItems;
          $scope.fees = function(cartItem) {
            return !cartItem.percentage;
          }
          $scope.giftCards = function(cartItem) {
            return cartItem.percentage;
          }
        }
      })
      .state('confirmation', {
        url: '/confirmation',
        templateUrl: 'templates/confirmation.html',
        resolve: {
          CartService: 'CartService'
        },
        controller: function($scope, CartService) {
          $scope.allCartItems = CartService.allCartItems;
        }
      })
});

snapscripApp.controller('CartController', function($scope, CartService) {
  $scope.cartItems = 400;
  $scope.itemsInCart = CartService.allCartItems();

  $scope.removeItem = function(card) {
    CartService.removeItemFromCart(card);
  };

});

snapscripApp.controller('CardController', function($scope, CardService) {
  $scope.card = {};
});

snapscripApp.controller('ScripController', function($scope, $location, CardService, CartService) {
  var scripCtrl = this;
  scripCtrl.searchCriteria = "";
  scripCtrl.schoolName = 'St. Joan of Arc';

  scripCtrl.allCards = function() {
    return CardService.allCards();
  };
  scripCtrl.addToCart = function(giftCard, value) {
    CartService.addItemToCard(giftCard, value);
  };

});

snapscripApp.controller('BaseController', function($scope, LocationService) {
  var baseCtrl = this;
  baseCtrl.viewCart = LocationService.cart;
  baseCtrl.viewHome = LocationService.home;
});


snapscripApp.filter('valueAggregate', function() {
  return function(itemsWithValue) {
    return _.reduce(itemsWithValue, function(total, nextItem) {
      total += parseInt(nextItem.value);
      return total;
    }, 0);
  }
});
snapscripApp.filter('countAggregate', function() {
  return function(items) {
    return _.size(items);
  }
});
snapscripApp.filter('donationAggregate', function() {
  return function(itemsWithValue) {
    return parseFloat(_.reduce(itemsWithValue, function(total, nextItem) {
      total += (parseInt(nextItem.value)  * (nextItem.percentage / 100));
      return total;
    }, 0)).toFixed(2);
  }
});

snapscripApp.directive('gcard', function($location) {
  var imgElement = angular.element("<img ng-class='imgClass' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()' data-content='This is where you buy buy buy' src='{{giftcard.path}}'>");
  var textElement = angular.element("<h2 ng-class='textClass' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()'>{{giftcard.percentage}}%</h2>");
  var instructionsElement = angular.element("<p ng-class='instructionClass' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()'>Click to Buy</p>");

  var link = function(scope, element) {
    scope.imgClass = 'ui large image';
    scope.textClass = 'imageHide';
    scope.instructionClass = 'imageHide';

    scope.hoverGiftCard = function() {
      scope.imgClass = "ui large disabled image";
      scope.textClass = 'imageText';
      scope.instructionClass = 'instructionText';
    };
    scope.exitGiftCard = function() {
      scope.imgClass = 'ui large image';
      scope.textClass = 'ui link imageHide';
      scope.instructionClass = 'ui link imageHide';
    };
    scope.viewCard = function() {
      $location.path("/cards/" + scope.giftcard.name)
    };
  };

  return {
    restrict: 'E',
    replace: true,
//    transclude: true,
    scope: {
      giftcard: '=data'
    },
    templateUrl: 'templates/gcard.html',
    compile: function(tElem) {
      tElem.append(imgElement);
      tElem.append(textElement);
      tElem.append(instructionsElement);
      tElem.append(angular.element("<br>"));

      return link;
    }
  }
});

snapscripApp.directive('imagedouble', function() {
  return function(scope, element) {
    element.bind('mouseenter', function() {

    });
  }
});

snapscripApp.factory('LocationService', function($location) {
  return {
    'home': function() {
      $location.path('/');
    },
    'cart': function() {
      $location.path('/cart');
    }
  }
});
