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


snapscripApp.factory('PdfService', function($http) {

  return {
    'getPdf': function() {
      return $http.get('rest/form.json').success(function(formData) {
        var pageData1 = formData[0].pages[0].image;
        var pageData2 = formData[0].pages[1].image;

        var pageOneCoords = formData[0].pages[0].fields;
        var pageTwoCoords = formData[0].pages[1].fields;

        var doc = new jsPDF();
        doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
        doc.setFontSize(10);
        doc.text(20, 20, 'printed by Snap-Scrip');
        for (var i = 0; i < pageOneCoords.length; i++) {
          var coords = pageOneCoords[i];
          doc.text(parseInt(coords.quantity.x), parseInt(coords.quantity.y), coords.amount);
          doc.text(parseInt(coords.value.x), parseInt(coords.value.y), coords.amount);
        }
        doc.addPage();
        doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
        doc.setFontSize(10);
        doc.text(20, 20, 'printed by Snap-Scrip');
        for (var i = 0; i < pageTwoCoords.length; i++) {
          var coords = pageTwoCoords[i];
          doc.text(parseInt(coords.quantity.x), parseInt(coords.quantity.y), coords.amount);
          doc.text(parseInt(coords.value.x), parseInt(coords.value.y), coords.amount);
        }
        doc.save('Test.pdf');
      }).error(function(data) {
        alert("error retrieving form data");
      });
    },
    'printAll': function(){
      var doc = new jsPDF();
      doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
      doc.setFontSize(10);
      for (var i = 0; i < formCoords.length; i++) {
        var coords = formCoords[i];
        doc.text(parseInt(coords.quantity.x), parseInt(coords.quantity.y), '3');
        doc.text(parseInt(coords.value.x), parseInt(coords.value.y), '3');
      }
      doc.text(20, 230, 'This is client-side Javascript, pumping out a PDF.');
      doc.addPage();
      doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
      doc.save('Test.pdf');
      return $http.get('rest/form.json').success(function(formData) {
        var pageData1 = formData[0].pages[0].image;
        var pageData2 = formData[0].pages[1].image;

        var pageOneCoords = formData[0].pages[0].fields;
        var pageTwoCoords = formData[0].pages[1].fields;

        var doc = new jsPDF();
        doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
        doc.setFontSize(10);
        for (var i = 0; i < formCoords.length; i++) {
          var coords = formCoords[i];
          doc.text(parseInt(coords.quantity.x), parseInt(coords.quantity.y), '3');
          doc.text(parseInt(coords.value.x), parseInt(coords.value.y), '3');
        }
        doc.text(20, 230, 'This is client-side Javascript, pumping out a PDF.');
        doc.addPage();
        doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
        doc.addtext(0, 0, 'printed by Snap-Scrip');
        doc.save('Test.pdf');
      }).error(function(data) {
        alert("error retrieving form data");
      });
    }
  }
});