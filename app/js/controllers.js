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
          cardLookup.promise.then(function(data){$scope.card = data});
          $scope.addToCart = CartService.addItemToCart;
          $scope.cardCount = CartService.cardCount;
          $scope.clearCards = CartService.clearCards;
          $scope.viewCart = LocationService.cart;
          $scope.removeItemFromCart = CartService.removeItemFromCart;
          $scope.clearCardsForAllValues = function() {
            _.forEach($scope.card.values, function(value) {
              $scope.clearCards($scope.card.name, parseInt(value));
            });
          }
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
          $scope.addTransactionFee = CartService.addTransactionFee;
        }
      })
      .state('review', {
        url: '/review',
        templateUrl: 'templates/review.html',
        resolve: {
          CartService: 'CartService',
          PdfService: 'PdfService',
          OrderService: 'OrderService',
          LocationService: 'LocationService'
        },
        controller: function($scope, PdfService, CartService, OrderService, LocationService) {
          $scope.generatePdf = PdfService.getPdf;
          $scope.allCartItems = CartService.allCartItems;
          $scope.addTransactionFee = CartService.addTransactionFee;
          $scope.fees = function(cartItem) {
            return !cartItem.percentage;
          }
          $scope.giftCards = function(cartItem) {
            return cartItem.percentage;
          }
          $scope.confirmOrder = function() {
            OrderService.save(
              {'firstName': $scope.firstName, 'lastName': $scope.lastName, 'phone': $scope.phone, 'email': $scope.email,
                'rectoryPickup':$scope.rectoryPickup, 'afterMass':$scope.afterMass, 'sendHome':$scope.sendHome, 'childName':$scope.childName, 'homeroom':$scope.homeroom,
                'checkNumber':$scope.checkNumber, 'checkAmount':$scope.checkAmount
              },
              $scope.allCartItems()
            );
            LocationService.confirmation();
          }
        }
      })
      .state('confirmation', {
        url: '/confirmation',
        templateUrl: 'templates/confirmation.html',
        resolve: {
          CartService: 'CartService',
          OrderService: 'OrderService',
          PdfService: 'PdfService'
        },
        controller: function($scope, CartService, OrderService, PdfService) {
          $scope.allCartItems = CartService.allCartItems;
          $scope.confirmOrder = OrderService.confirmOrder;
          $scope.currentOrder = OrderService.currentOrder;
          $scope.getPdf = PdfService.getPdf;

//          $scope.order = {
//            orderId:'meganmenne-1234',
//            orderInformation:{firstName:'Megan', lastName:'Menne', phoneNumber:'314 477 1111', rectoryPickup:1, afterMass:1, sendHome:1, childName:'Laura', homeroom:'3rd', checkNumber:1001, checkAmount:100 },
//            orders:[{'name':'Amazon', 'value':50}, {'name':'Amazon', 'value':50}]}
          $scope.order = OrderService.currentOrder();
          $scope.confirmationNumber = $scope.order.orderId;
          PdfService.getPdf($scope.order).promise.then(function(pdf) {
            //pdf.save('1234');
            var pdfSource = pdf.output('datauristring');
            angular.element('#pdfViewer').append("<iframe frameborder='0' src='" + pdfSource + "' width='650' height='450'></iframe>")
            $scope.pdfSource = pdfSource;
          });
          $scope.downloadCurrent = function() {
            PdfService.getPdf($scope.order).promise.then(function(pdf) {
              pdf.save($scope.confirmationNumber);
            });
          }
        }
      })
});

snapscripApp.controller('CartController', function($scope, CartService) {
  var cartCtrl = this;
  $scope.cartItems = ['a', 'b'];
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
  scripCtrl.giftcards = [];
  scripCtrl.searchCriteria = "";
  scripCtrl.schoolName = 'St. Joan of Arc';

  scripCtrl.viewCard = function(giftcard) {
    console.log(giftcard.key);
    $location.path("/cards/" + giftcard.key);
  };

  scripCtrl.allCards = function() {
    return CardService.allCards();
  };
  scripCtrl.addToCart = function(giftCard, value) {
    CartService.addItemToCard(giftCard, value);
  };

  scripCtrl.filterIt = function(searchValue) {

  };

  $scope.searchCards = function(ev) {
    if (ev.which==13 || ev.which == 1) {
      $scope.enteredSearchCriteria = $scope.searchCriteria;
    }
  }

});

snapscripApp.controller('BaseController', function($scope, LocationService, $location) {
  var baseCtrl = this;
  baseCtrl.$location = $location;
  baseCtrl.cartItems = ['a', 'b'];
  baseCtrl.viewCart = LocationService.cart;
  baseCtrl.viewHome = LocationService.home;
});


snapscripApp.filter('valueAggregate', function() {
  return function(itemsWithValue) {
    return _.reduce(itemsWithValue, function(total, nextItem) {
      total += parseFloat(nextItem.value);
      return total;
    }, 0);
  }
});
snapscripApp.filter('totalAggregate', function() {
  return function(itemsWithValue) {
    return _.reduce(itemsWithValue, function(total, nextItem) {
      total += parseFloat(nextItem.total);
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
snapscripApp.filter('orderAggregate', function() {
  return function(orders) {
    var totals = [];
    var cardGroups = _.groupBy(orders, "name");
    for (var cardName in cardGroups) {
      var count = 0;
      var totalValue = 0;
      var cardOrders = _.filter(orders, function(order) { return order.name == cardName});
      for (var cardOrderNumber in cardOrders) {
        count++;
        totalValue = totalValue + cardOrders[cardOrderNumber].value;
      }
      if (count) {
        totals.push({name:cardName, total:totalValue, count:count});
      }
    }
    return totals;
  }
});

snapscripApp.filter('cardName', function() {
  return function(imagePath) {
    return imagePath.split('/')[1].split('.')[0].split('-')[0];
  }
});

snapscripApp.directive('gcard', function($location) {

  var imgElement = angular.element("<img ng-class='imgClass' id='{{giftcard.key}}' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()' data-content='This is where you buy buy buy' src='{{giftcard.path}}'>");
  var textElement = angular.element("<h2 ng-class='textClass' id='{{giftcard.key}}' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()'>{{giftcard.percentage}}%</h2>");
  var instructionsElement = angular.element("<p ng-class='instructionClass' ng-mouseover='hoverGiftCard()' ng-mouseleave='exitGiftCard()' ng-click='viewCard()'>Click to Buy</p>");

  var link = function(scope, element) {
    scope.imgClass = 'ui small image';
    scope.textClass = 'imageHide';
    scope.instructionClass = 'imageHide';

    scope.hoverGiftCard = function() {
      scope.imgClass = "ui small disabled image";
      scope.textClass = 'imageText';
      scope.instructionClass = 'instructionText';
    };
    scope.exitGiftCard = function() {
      scope.imgClass = 'ui small image';
      scope.textClass = 'ui link imageHide';
      scope.instructionClass = 'ui link imageHide';
    };
    scope.viewCard = function() {
      console.log(scope.giftcard.key);
      $location.path("/cards/" + scope.giftcard.key);
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
    },
    'confirmation': function() {
      $location.path('/confirmation');
    }
  }
});

snapscripApp.controller('TestController', function($scope, PdfService) {
  var testController = this;

  $scope.pdfSource = 'admin.html';
  $scope.PdfService = PdfService;

  $scope.generatePdf = function(order) {
    var pdfPromise = PdfService.getPdf(order)
    pdfPromise.promise.then(function(pdf) {
      $scope.pdfSource = pdf.output('datauristring');
      $('iframe').attr('src', $scope.pdfSource);
      console.log($scope.pdfSource);
    });
  }

  $scope.testOrder = {
    orderInformation: {
      name: 'Megan Menne',
      phoneNumber: '314 304 3148',
      accountNumber: '123455',
      routingNumber: '123423434535',
      checkNumber: 1001,
      checkAmount: 100
    },
    orders: [
      {name:'Amazon', value:25},
      {name:'Amazon', value:25},
      {name:'Amazon', value:25},
      {name:'Applebees', value:50},
      {name:'Applebees', value:50},
      {name:'Biggies Restaurant', value:25},
      {name:'Chris Pancakes', value:25},
      {name:'KFC', value:5},
      {name:'Le Grands', value:25}
    ]
  };

  $scope.generatePdf($scope.testOrder);

});
