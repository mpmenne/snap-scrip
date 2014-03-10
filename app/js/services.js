'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var snapscripApp = angular.module('snapscripApp_services', []);


snapscripApp.factory('CartService', function() {
  var orders = [];
  return {
    'allCartItems': function() {
      var goodOrders = [];
      for (var i = 0; i < orders.length; i++) {
        if (!orders[i].deleted) {
          goodOrders.push(orders[i]);
        }
      }
      return goodOrders;
    },
    'addItemToCart': function(giftcard, value) {
      orders.push({
        name: giftcard.name,
        value: value,
        logo: giftcard.logo,
        path: giftcard.path,
        percentage: giftcard.percentage
      });
      console.log('add giftcard');
    },
    'addCheckProcessing': function() {
//      orders.push({
//        name: 'Electronic Check Fee',
//        value: 1,
//        percentage: 0
//      });
      console.log('added checkprocessing');
    },
    'removeItemFromCart': function(cartItem) {
      cartItem.deleted = true;
    },
    'clearCart': function() {
      orders = [];
    }
  }
});

snapscripApp.factory('CardService', function($http) {
  var giftcards;
  $http.get('rest/cards.json').success(function(data) {
    giftcards = data;
  }).error(function(data) {
    alert('error retrieving gift cards');
  });

  return {
    findCard: function(name) {
      var i;
      for (i = 0; i < giftcards.length; ++i) {
        if (name === giftcards[i].name) {
          return giftcards[i];
        }
      }
      return {};
    },
    allCards: function() {
      return giftcards;
    }
  }
});


snapscripApp.factory('PdfService', function($http, $q, $filter) {
  var totalOrderAggregate = $filter('orderAggregate');
  return {
    'getPdf': function(orders) {
      var orderTotals = totalOrderAggregate(orders.orders);
      var pdfPromise = $q.defer();
      $http.get('rest/form.json').success(function(formData) {
          var pageData1 = formData[0].pages[0].image;
          var pageData2 = formData[0].pages[1].image;

          var pageOneCoords = formData[0].pages[0].fields;
          var pageTwoCoords = formData[0].pages[1].fields;

          var doc = new jsPDF();
          doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
          doc.setFontSize(10);
          doc.text(73, 57, orders.orderInformation.name);
          doc.text(73, 62, orders.orderInformation.phoneNumber);
          doc.text(163, 57, '' + (new Date().getMonth() + 1)  + '-' + new Date().getDate() + '-' + new Date().getFullYear());
          doc.text(117, 212, 'X');
          doc.text(117, 217, 'X');
          doc.text(117, 222, 'X');
          doc.text(163, 250, 'In Stock Total');
          doc.text(163, 255, 'Special Total');
          doc.text(163, 263, 'Total');
          doc.text(137, 271, 'Check Number');
          doc.text(20, 20, 'printed by Snap-Scrip');
          for (var i = 0; i < pageOneCoords.length; i++) {
            var coords1 = pageOneCoords[i];
            var matchingOrderTotal = _.filter(orderTotals, function(order) { return order.name == coords1.name});
            console.log('Matching Order ' + matchingOrderTotal);
            if (matchingOrderTotal.length) {
              console.log('Huha ' + matchingOrderTotal[0]);
              doc.text(parseInt(coords1.quantity.x), parseInt(coords1.quantity.y), '' + matchingOrderTotal[0].count);
              doc.text(parseInt(coords1.value.x), parseInt(coords1.value.y), '' + matchingOrderTotal[0].total);
            }
          }
          doc.addPage();
          doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
          doc.setFontSize(10);
          doc.text(128, 56, 'Special Order 1');
          doc.text(164, 56, 'Value');
          doc.text(181, 56, 'Qty');
          doc.text(191, 56, 'Total');
          doc.text(128, 61, 'Special Order 2');
          doc.text(164, 61, 'Value');
          doc.text(181, 61, 'Qty');
          doc.text(191, 61, 'Total');
          doc.text(128, 65, 'Special Order 3');
          doc.text(164, 65, 'Value');
          doc.text(181, 65, 'Qty');
          doc.text(191, 65, 'Total');
          doc.text(128, 69, 'Special Order 4');
          doc.text(164, 68, 'Value');
          doc.text(181, 69, 'Qty');
          doc.text(191, 69, 'Total');
          doc.text(128, 73, 'Special Order 5');
          doc.text(164, 73, 'Value');
          doc.text(181, 73, 'Qty');
          doc.text(191, 73, 'Total');
          doc.text(128, 77, 'Special Order 6');
          doc.text(164, 77, 'Value');
          doc.text(181, 77, 'Qty');
          doc.text(191, 77, 'Total');
          doc.text(128, 81, 'Special Order 7');
          doc.text(164, 81, 'Value');
          doc.text(181, 81, 'Qty');
          doc.text(191, 81, 'Total');
          doc.text(128, 86, 'Special Order 8');
          doc.text(164, 86, 'Value');
          doc.text(181, 86, 'Qty');
          doc.rect(118, 200, 80, 40);
          doc.text(120, 205, 'Payment Authorization:');
          doc.text(120, 215, 'This payment was authorized by:');
          doc.setFontStyle('bold');
          doc.text(120, 220,  orders.orderInformation.name + ' at 2:22 PM on 3-9-2014');
          doc.setFontStyle('normal');
          doc.text(120, 225, 'Check Number: ' + orders.orderInformation.checkNumber);
          doc.text(120, 230, 'Routing Number: ' + orders.orderInformation.routingNumber);
          doc.text(120, 235, 'Account Number: ' + orders.orderInformation.accountNumber);
          doc.text(120, 86, 'Total');
          doc.text(20, 20, 'printed by Snap-Scrip');
          for (var i = 0; i < pageTwoCoords.length; i++) {
            var coords2 = pageTwoCoords[i];
            var matchingOrderTotal = _.filter(orderTotals, function(order) { return order.name == coords2.name});
            console.log('Matching Order ' + matchingOrderTotal);
            if (matchingOrderTotal.length) {
              console.log('Huha ' + matchingOrderTotal[0]);
              doc.text(parseInt(coords2.quantity.x), parseInt(coords2.quantity.y), '' + matchingOrderTotal[0].count);
              doc.text(parseInt(coords2.value.x), parseInt(coords2.value.y), '' + matchingOrderTotal[0].total);
            }
          }
          pdfPromise.resolve(doc);
          //doc.save('Test.pdf');
      }).error(function(data) {
        alert("error retrieving form data");
      });
      return pdfPromise;
    },
    'printAll': function(){
      var pdfPromise = $q.defer();
      $http.get('rest/form.json').success(function(formData) {
        var pageData1 = formData[0].pages[0].image;
        var pageData2 = formData[0].pages[1].image;

        var pageOneCoords = formData[0].pages[0].fields;
        var pageTwoCoords = formData[0].pages[1].fields;

        var doc = new jsPDF();
        doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
        doc.setFontSize(10);
        doc.text(73, 57, 'Mike Menne');
        doc.text(73, 62, '314 477 9816');
        doc.text(163, 57, '' + (new Date().getMonth() + 1)  + '-' + new Date().getDate() + '-' + new Date().getFullYear());
        doc.text(117, 212, 'X');
        doc.text(117, 217, 'X');
        doc.text(117, 222, 'X');
        doc.text(163, 250, 'In Stock Total');
        doc.text(163, 255, 'Special Total');
        doc.text(163, 263, 'Total');
        doc.text(137, 271, 'Check Number');
        doc.text(20, 20, 'printed by Snap-Scrip');
        for (var i = 0; i < pageOneCoords.length; i++) {
          var coords1 = pageOneCoords[i];
          doc.text(parseInt(coords1.quantity.x), parseInt(coords1.quantity.y), coords1.amount);
          doc.text(parseInt(coords1.value.x), parseInt(coords1.value.y), coords1.amount);
        }
        doc.addPage();
        doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
        doc.setFontSize(10);
        doc.text(128, 56, 'Special Order 1');
        doc.text(164, 56, 'Value');
        doc.text(181, 56, 'Qty');
        doc.text(191, 56, 'Total');
        doc.text(128, 61, 'Special Order 2');
        doc.text(164, 61, 'Value');
        doc.text(181, 61, 'Qty');
        doc.text(191, 61, 'Total');
        doc.text(128, 65, 'Special Order 3');
        doc.text(164, 65, 'Value');
        doc.text(181, 65, 'Qty');
        doc.text(191, 65, 'Total');
        doc.text(128, 69, 'Special Order 4');
        doc.text(164, 68, 'Value');
        doc.text(181, 69, 'Qty');
        doc.text(191, 69, 'Total');
        doc.text(128, 73, 'Special Order 5');
        doc.text(164, 73, 'Value');
        doc.text(181, 73, 'Qty');
        doc.text(191, 73, 'Total');
        doc.text(128, 77, 'Special Order 6');
        doc.text(164, 77, 'Value');
        doc.text(181, 77, 'Qty');
        doc.text(191, 77, 'Total');
        doc.text(128, 81, 'Special Order 7');
        doc.text(164, 81, 'Value');
        doc.text(181, 81, 'Qty');
        doc.text(191, 81, 'Total');
        doc.text(128, 86, 'Special Order 8');
        doc.text(164, 86, 'Value');
        doc.text(181, 86, 'Qty');
        doc.rect(118, 200, 80, 40);
        doc.text(120, 205, 'Payment Authorization:');
        doc.text(120, 215, 'This payment was authorized by:');
        doc.setFontStyle('bold');
        doc.text(120, 220, 'Mike Menne at 2:22 PM on 3-9-2014');
        doc.setFontStyle('normal');
        doc.text(120, 225, 'Check Number: 405');
        doc.text(120, 230, 'Routing Number: 123456');
        doc.text(120, 235, 'Account Number: 12345345677');
        doc.text(120, 86, 'Total');
        doc.text(20, 20, 'printed by Snap-Scrip');
        for (var i = 0; i < pageTwoCoords.length; i++) {
          var coords2 = pageTwoCoords[i];
          doc.text(parseInt(coords2.quantity.x), parseInt(coords2.quantity.y), coords2.amount);
          doc.text(parseInt(coords2.value.x), parseInt(coords2.value.y), coords2.amount);
        }
        pdfPromise.resolve(doc);
        //doc.save('Test.pdf');
      }).error(function(data) {
            alert("error retrieving form data");
          });
      return pdfPromise;
    }
  }
});