'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var snapscripApp = angular.module('snapscripApp_services', []);


snapscripApp.factory('CartService', function() {
  var orders = [];
  return {
    'allCartItems': function() {
      return orders;
    },
    'addItemToCart': function(giftcard, value) {
      orders.push({
        name: giftcard.name,
        key: giftcard.key,
        value: parseInt(value),
        logo: giftcard.logo,
        path: giftcard.path,
        percentage: giftcard.percentage
      });
    },
    'addTransactionFee': function(name, amount) {
      console.log('fee and amount: ' + name + ' ' + ' and ' + amount);
      _.remove(orders, function(order) { return order.name.indexOf('Fee') != -1; });
      if(name && amount) {
        orders.push({
          name: name,
          value: amount,
          percentage: 0,
          type: 'fee'
        });
      }
    },
    'totalCartAmount': function(){
      return _.reduce(orders, function(total, item) {
        return total + parseFloat(item.value);
      }, 0);
    },
    'removeItemFromCart': function(cartItem) {
      _.remove(orders, function(order) { return order.name === cartItem.name && parseInt(order.value) === parseInt(cartItem.value)} );
      cartItem.deleted = true;
    },
    'clearCart': function() {
      orders = [];
    },
    'cardCount': function(cardName, cardValue) {
      return _.filter(orders, function(order) { return order.name === cardName && order.value === parseInt(cardValue)}).length;
    },
    'clearCards': function(cardName, cardValue) {
      _.remove(orders, function(order) { return order.name === cardName && parseInt(order.value) === parseInt(cardValue)});
    }
  }
});

snapscripApp.factory('CardService', function($http, $q) {
//  var giftcards;
//  $http.get('rest/cards.json').success(function(data) {
//    giftcards = data;
//  }).error(function(data) { alert('error retrieving gift cards'); });

  var giftcards =
      [
        {"key":"amazon", "name":"Amazon", "path": "img/amazon-giftcard.jpg", "logo": "img/amazon-giftcard.jpg", "percentage": 4, "values": ["25", "100"], "tags":"books, electronics, kindle"},
        {"key":"homedepot", "name":"Home Depot", "path": "img/homedepot-giftcard.jpeg", "logo": "img/homedepot-logo.gif", "percentage": 4, "values": ["25", "100", "500"], "tags":"tools, house supplies"},
        {"key":"starbucks", "name":"Starbucks", "path": "img/starbucks-gift-card.jpg", "logo": "img/starbucks-logo.jpg", "percentage": 7, "values": ["10", "25"], "tags":"coffee"},
        {"key":"chrispancakes", "name":"Chris Pancakes", "path": "img/chispancakes-giftcard.png", "logo": "img/chrispancakes-giftcard.png", "percentage": 10, "values": ["10", "25"], "tags":"food, local"},
        {"key":"bassproshop", "name":"Bass Pro Shop", "path": "img/basspro-giftcard.jpg", "logo": "img/bassproshop-logo.jpg", "percentage": 9, "values": ["25", "100"], "tags":"hunting, fishing, sporting goods"},
        {"key":"cabelas", "name":"Cabelas", "path": "img/cabelas-giftcard.jpg", "logo": "img/cabelas-logo.jpg", "percentage": 11, "values": ["25", "100"], "tags":"hunting, fishing, sporting goods"},
//        {"key":"circlek", "name":"Circle K", "path": "img/circlek-giftcard.jpeg", "logo": "img/circlek-logo.png", "percentage": 1.5, "values": ["25", "100"], "tags":"gas"},
        {"key":"oldnavy", "name":"Old Navy", "path": "img/oldnavy-giftcard.jpg",  "logo": "img/oldnavy-logo.png", "percentage": 14, "values": ["25", "100"], "tags":"clothes"},
        {"key":"pfchangs", "name":"PF Changs", "path": "img/pfchangs-giftcard.png",  "logo": "img/pfchangs-logo.jpeg", "percentage": 8, "values": ["25"], "tags":"food, restaurant"},
        {"key":"shell", "name":"Shell", "path": "img/shell-giftcard.jpeg", "logo": "img/shell_logo.jpg", "percentage": 2.5, "values": ["25", "50", "100"], "tags":"gas"},
//        {"key":"acehardware", "name":"Ace Hardware", "path": "img/ace-giftcard.jpeg", "logo": "img/ace-logo.jpeg", "percentage": 4, "values": ["25", "100"], "tags":"tools, home improvement"},
//        {"key":"aeropostale", "name":"Aeropostale", "path": "img/aerogiftcard.jpg", "logo": "img/aeropostale.jpeg", "percentage": 7, "values": ["25"], "tags":"clothes"},
        {"key":"amctheatres", "name":"AMC Theatres", "path": "img/amctheatres-giftcard.jpg", "logo": "img/amctheatres.jpeg", "percentage": 8, "values": ["25"], "tags":"movies"},
        {"key":"americaneagle", "name":"American Eagle Outfitters", "path": "img/americaneagle-giftcard.jpeg", "logo": "img/americaneagle.gif", "percentage": 10, "values": ["25"], "tags":"clothes"},
        {"key":"applebees", "name":"Applebees", "path": "img/applesbees-giftcard.jpeg", "logo": "img/applebees-logo.jpeg", "percentage": 8, "values": ["25", "50"], "tags":"food, restaurant"},
        {"key":"arbys", "name":"Arbys", "path": "img/arbys-giftcard.jpg", "logo": "img/arbys-logo.jpeg", "percentage": 8, "values": ["10"], "tags":"food, restaurant, fast food"},
        {"key":"autozone", "name":"Autozone", "path": "img/autozone-giftcard.gif", "logo": "img/autozone-logo.jpeg", "percentage": 8, "values": ["25"], "tags":"car"},
        {"key":"babiesrus", "name":"Babies R Us", "path": "img/babiesrus-giftcard.jpeg", "logo": "img/babiesrus-logo.jpeg", "percentage": 1.5, "values": ["20"], "tags":"clothes, kids"},
//        {"key":"bananarepublic", "name":"Banana Republic", "path": "img/bananarepublic-giftcard.jpeg", "logo": "img/bananarepublic.png", "percentage": 14, "values": ["25", "100"], "tags":"clothes"},
        {"key":"barnesandnoble", "name":"Barnes and Noble", "path": "img/barnesnoble-giftcard.jpg", "logo": "img/barnesandnoble-logo.jpeg", "percentage": 9, "values": ["10", "25", "100"], "tags":"books"},
        {"key":"bedbathandbeyond", "name":"Bed Bath and Beyond", "path": "img/bedbathbeyond-giftcard.jpg", "logo": "img/bedbathandbeyond.gif", "percentage": 7, "values": ["25", "100"], "tags":"gifts"},
        {"key":"bathandbodyworks", "name":"Bath and Body Works", "path": "img/bathandbodyworks-giftcard.jpeg", "logo": "img/bathandbodyworks-giftcard.jpeg", "percentage": 13, "values": ["10", "25"], "tags":"gifts, mall"},
//        {"key":"bostonmarket", "name":"Boston Market", "path": "img/bostonmarket-giftcard.jpeg", "logo": "img/bostonmarket-giftcard.jpeg", "percentage": 12, "values": ["10"], "tags":"food, restaurant, take out"},
        {"key":"blockbuster", "name":"Blockbuster", "path": "img/blockbuster-giftcard.jpeg", "logo": "img/blockbuster-giftcard.jpeg", "percentage": 7, "values": ["10"], "tags":"movies, entertainment"},
        {"key":"bestbuy", "name":"Best Buy", "path": "img/bestbuy-giftcard.gif", "logo": "img/bestbuy-logo.png", "percentage": 3, "values": ["25", "100", "250"], "tags":"electronics"},
        {"key":"biggies", "name":"Biggies Restaurant", "path": "img/biggies-giftcard.jpeg", "logo": "img/biggies-giftcard.jpeg", "percentage":10, "values": ["25"], "tags":"local, food"},
        {"key":"bobevans", "name":"Bob Evans", "path": "img/bobevans-giftcard.gif", "logo": "img/bobevans-logo.jpg", "percentage": 10, "values": ["10"], "tags":"food, restaurant"},
//        {"key":"brooksbrothers", "name":"Brooks Brothers", "path": "img/brooksbrothers-giftcard.jpg", "logo": "img/brooksbrothers-logo.jpeg", "percentage": 16, "values": ["25"], "tags":"clothes"},
//        {"key":"buffalowildwings", "name":"Buffalo Wild Wings", "path": "img/buffalowildwings-giftcard.png", "logo": "img/buffalowildwings.jpeg", "percentage": 8, "values": ["10", "25"], "tags":"food, restaurant"},
        {"key":"buildabear", "name":"Build a Bear", "path": "img/buildabear-giftcard.jpg", "logo": "img/buildabear-logo.jpeg", "percentage": 8, "values": ["25"], "tags":"gifts"},
        {"key":"burgerking", "name":"Burger King", "path": "img/burgerking-giftcard.jpeg", "logo": "img/burgerking-logo.png", "percentage": 4, "values": ["10"], "tags":"food, restaurant"},
        {"key":"californiapizzakitchen", "name":"California Pizza Kitchen", "path": "img/californiapizza-giftcard.jpg", "logo": "img/californiapizzakitchen.jpg", "percentage": 4, "values": ["10"], "tags":"food, restaurant"},
        {"key":"cheesecakefactory", "name":"Cheese Cake Factory", "path": "img/cheesecakefactory-giftcard.jpeg", "logo": "img/cheesecakefactory-logo.jpg", "percentage": 6, "values": ["25"], "tags":"food, restaurant"},
        {"key":"chevysfreshmex", "name":"Chevys", "path": "img/chevys-giftcard.jpg", "logo": "img/chevys-logo.gif", "percentage": 8, "values": ["25"], "tags":"food, restaurant"},
        {"key":"chilis", "name":"Chilis", "path": "img/chilis-giftcard.jpg", "logo": "img/chilis-logo.jpg", "percentage": 11, "values": ["25"], "tags":"food, restaurant"},
//        {"key":"chipotle", "name":"Chipotle", "path": "img/chipolte-giftcard.jpg", "logo": "img/chipotle-logo.jpg", "percentage": 10, "values": ["10"], "tags":"food, restaurant"},
        {"key":"chuckecheese", "name":"Chuck E Cheese", "path": "img/chuckecheese-giftcard.jpg", "logo": "img/chuckecheese-logo.jpg", "percentage": 8, "values": ["10"], "tags":"kids, food"},
//        {"key":"coldstonecreamery", "name":"Cold Stone Creamery", "path": "img/coldstonecreamery-giftcard.jpg", "logo": "img/coldstonecreamery-logo.jpeg", "percentage": 8, "values": ["10"], "tags":"food"},
//        {"key":"crateandbarrel", "name":"Crate and Barrel", "path": "img/crateandbarrel-giftcard.jpeg", "logo": "img/crateandbarrel-logo.jpg", "percentage": 8, "values": ["25", "100"], "tags":"home"},
        {"key":"crackerbarrel", "name":"Cracker Barrel", "path": "img/crackerbarrel-giftcard.jpg", "logo": "img/crackerbarrel-giftcard.jpg", "percentage": 9, "values": ["10"], "tags":"restaurant, sit down, breakfast"},
        {"key":"cvs", "name":"CVS", "path": "img/cvs-giftcard.jpg", "logo": "img/cvs-logo.jpeg", "percentage": 7, "values": ["25", "100"], "tags":"pharmacy"},
//        {"key":"dennys", "name":"Dennys", "path": "img/dennys-giftcard.jpeg", "logo": "img/dennys-logo.png", "percentage": 7, "values": ["10"], "tags":"food, restaurant"},
        {"key":"daveandbusters", "name":"Dave and Busters", "path": "img/daveandbusters-giftcard.jpg", "logo": "img/daveandbusters-giftcard.jpg", "percentage": 13, "values": ["25"], "tags":"food, restaurant, games, entertainment"},
        {"key":"dicks", "name":"Dicks", "path": "img/dicks-giftcard.png", "logo": "img/dicks-logo.png", "percentage": 8, "values": ["25", "100"], "tags":"sports"},
        {"key":"dressbarn", "name":"Dressbarn", "path": "img/dressbarn-giftcard.jpeg", "logo": "dressbar.jpeg", "percentage": 8, "values": ["25"], "tags":"clothing, womens"},
        {"key":"dillards", "name":"Dillards", "path": "img/dillards-giftcard.jpeg", "logo": "img/dillards-logo.jpeg",  "percentage": 9, "values": ["25", "100"], "tags":"clothes"},
        {"key":"dominoespizza", "name":"Dominoes", "path": "img/dominoes-giftcard.jpg", "logo": "img/dominos-logo.jpeg", "percentage": 8, "values": ["10"], "tags":"food, restaurant, pizza"},
//        {"key":"dunkindonuts", "name":"Dunkin Donuts", "path": "img/dunkindonuts-giftcard.jpg", "logo": "img/dunkindonuts-logo.jpeg", "percentage": 3, "values": ["10"], "tags":"food"},
//        {"key":"express", "name":"Express", "path": "img/express-giftcard.jpeg", "logo": "img/express-logo.png", "percentage": 10, "values": ["25"], "tags":"clothes"},
        {"key":"favazzzas", "name":"Favazzas", "path": "img/favazzas-giftcard.gif", "logo": "img/favazzas-giftcard.gif", "percentage": 10, "values": ["25"], "tags":"local, food"},
        {"key":"fazolis", "name":"Fazolis", "path": "img/fazolis-giftcard.jpeg", "logo": "img/fazolis-giftcard.jpeg", "percentage": 7, "values": ["25"], "tags":"restaurant, italian, food"},
        {"key":"fashionbug", "name":"Fashion Bug", "path": "img/fashionbug-giftcard.png", "logo": "img/fashionbug-giftcard.png", "percentage": 6, "values": ["25"], "tags":"clothing, womens"},
        {"key":"gamestop", "name":"Game Stop", "path": "img/gamestop-giftcard.jpg", "logo": "img/gamestop-logo.jpg", "percentage": 3, "values": ["25"], "tags":"games"},
        {"key":"gordmans", "name":"Gordmans", "path": "img/fashionbug-giftcard.png", "logo": "img/fashionbug-giftcard.png", "percentage": 7, "values": ["25"], "tags":"clothing, mens, womens"},
        {"key":"greatclips", "name":"GreatClips", "path": "img/fashionbug-giftcard.png", "logo": "img/blockbuster-giftcard.jpeg", "percentage": 8, "values": ["25"], "tags":"services, hair"},
        {"key":"honeybakedham", "name":"Honey Baked Ham", "path": "img/honeybakedham-giftcard.jpeg", "logo": "img/honeybakedham-giftcard.jpeg", "percentage": 12, "values": ["25"], "tags":"food, take out"},
        {"key":"thegap", "name":"The Gap", "path": "img/gap-giftcard.jpg", "logo": "img/gap-logo.jpg", "percentage": 14, "values": ["25", "100"], "tags":"clothes"},
        {"key":"groupon", "name":"Groupon", "path": "img/groupon-giftcard.jpg", "logo": "img/groupon-giftcard.jpeg", "percentage": 7, "values": ["25"], "tags":"online, deals"},
        {"key":"guitarcenter", "name":"Guitar Center", "path": "img/guitar-center.jpg", "logo": "img/guitarcenter-logo.svg", "percentage": 4, "values": ["25"], "tags":"music"},
        {"key":"hardees", "name":"Hardees", "path": "img/hardees-giftcard.JPG", "logo": "img/hardees-logo.jpg", "percentage": 5, "values": ["10"], "tags":"food, restaurant"},
        {"key":"hometownbuffet", "name":"Home Town Buffet", "path": "img/hometownbuffet-giftcard.jpg", "logo": "img/hometownbuffet-giftcard.jpeg", "percentage": 5, "values": ["25"], "tags":"food, buffet, restaurant"},
        {"key":"itunes", "name":"iTunes", "path": "img/itunes-giftcard.jpg", "logo": "img/itunes-logo.jpeg", "percentage": 5, "values": ["15", "25"], "tags":"music"},
        {"key":"shutterfly", "name":"Shutterfly.com", "path": "img/shutterfly-giftcard.png", "logo": "img/shutterfly-giftcard.png", "percentage": 9, "values": ["25"], "tags":"online, pictures, photos"},
        {"key":"jcpenny", "name":"JC Penny", "path": "img/jcpenny-giftcard.jpeg", "logo": "img/jcpenny-logo.png", "percentage": 6, "values": ["25", "100"], "tags":"clothes"},
        {"key":"jackinthebox", "name":"Jack in the Box", "path": "img/jackinthebox-giftcard.jpeg", "logo": "img/jackinthebox-giftcard.jpeg", "percentage": 4, "values": ["10"], "tags":"food, fast food"},
//        {"key":"jiffylube", "name":"Jiffy Lube", "path": "img/jiffylube-giftcard.jpg", "logo": "img/jiffylube-lobibigo.jpeg", "percentage": 8, "values": ["30"], "tags":"car"},
        {"key":"joannfabrics", "name":"Joann Fabric", "path": "img/joannfabric-giftcard.jpeg", "logo": "img/joann-logo.jpeg", "percentage": 6, "values": ["25"], "tags":"clothes"},
//        {"key":"journeys", "name":"Journeys", "path": "img/journeys-giftcard.jpeg", "logo": "img/journeys-logo.jpeg", "percentage": 10, "values": ["25"], "tags":"clothes, shoes"},
//        {"key":"llbean", "name":"L.L. Bean", "path": "img/llbean-giftcard.jpeg", "logo": "img/llbean-giftcard.jpeg", "percentage": 16, "values": ["25", "100"], "tags":"clothing, mens, outdoor"},
//        {"key":"landsend", "name":"Lands' End", "path": "img/landsend-giftcard.jpg", "logo": "img/landsend-giftcard.jpg", "percentage": 16, "values": ["25", "100"], "tags":"clothing, mens, outdoor"},
//        {"key":"thelimited", "name":"The Limited", "path": "img/thelimited-giftcard.gif", "logo": "img/thelimited-giftcard.gif", "percentage": 9, "values": ["25"], "tags":"clothing, womens"},
//        {"key":"longhornsteakhouse", "name":"Longhorn Steakhouse", "path": "img/longhornsteakhouse-giftcard.jpeg", "logo": "img/longhornsteakhouse-giftcard.jpeg", "percentage": 9, "values": ["25"], "tags":"restaurant, steak"},
        {"key":"kmart", "name":"Kmart", "path": "img/kmart-giftcard.jpeg", "logo": "img/kmart-logo.gif", "percentage": 7, "values": ["25", "50"], "tags":"clothes, general"},
        {"key":"kohls", "name":"Kohls", "path": "img/kohls-giftcard.jpg", "logo": "img/kohls-logo.jpeg", "percentage": 4, "values": ["25", "100"], "tags":"clothes"},
        {"key":"kfc", "name":"KFC", "path": "img/kfc-giftcard.jpeg", "logo": "img/kfc-giftcard.jpeg", "percentage": 8, "values": ["5"], "tags":"food, fast"},
        {"key":"legrands", "name":"Le Grands", "path": "img/legrands-giftcard.jpg", "logo": "img/legrands-giftcard.jpg", "percentage": 3, "values": ["10", "20"], "tags":"local,food,grocery,deli"},
//        {"key":"littlecaesars", "name":"Little Caesars", "path": "img/littlecaesars-giftcard.jpeg", "logo": "img/littlecaesars-logo.jpg", "percentage": 8, "values": ["20"], "tags":"food, restaurant, pizza"},
        {"key":"lowes", "name":"Lowes", "path": "img/lowes-giftcard.jpg", "logo": "img/lowes-logo.jpg", "percentage": 4, "values": ["25", "50", "100", "500"], "tags":"home"},
        {"key":"matthewskitchen", "name":"Matthews Kitchen", "path": "img/matthewskitchen-giftcard.jpg", "logo": "img/matthewskitchen-giftcard.jpg", "percentage": 10, "values": ["25"], "tags":"food, local, restaurant"},
        {"key":"macys", "name":"Macys", "path": "img/macys-giftcard.jpeg", "logo": "img/macys-giftcard.jpeg", "percentage": 10, "values": ["25", "100"], "tags":"clothing, mens, womens"},
        {"key":"marshalls", "name":"Marshalls", "path": "img/marshalls-giftcard.jpeg", "logo": "img/marshalls-giftcard.jpeg", "percentage": 7, "values": ["25", "100"], "tags":"clothing, mens, womens"},
        {"key":"michaels", "name":"Michaels", "path": "img/michaels-giftcard.jpg", "logo": "img/michaels-giftcard.jpg", "percentage": 4, "values": ["25"], "tags":"crafts, art"},
//        {"key":"menswarehouse", "name":"Mens Warehouse", "logo": "img/menswarehouse-logo.jpeg", "path": "img/menswarehouse-giftcard.jpeg", "percentage": 8, "values": ["25"], "tags":"clothes"},
//        {"key":"niemanmarcus", "name":"Nieman Marcus", "path": "img/niemanmarcus-giftcard.jpeg", "logo": "img/niemanmarcus-logo.jpeg", "percentage": 12, "values": ["50"], "tags":"clothes"},
        {"key":"noodlesandcompany", "name":"Noodles and Company", "path": "img/noodlesandcompany-giftcard.jpg", "logo": "img/noodlesandcompany-logo.jpg", "percentage": 8, "values": ["10"], "tags":"food, restaurant"},
        {"key":"officedepot", "name":"Office Depot", "path": "img/officedepot-giftcard.jpeg", "logo": "img/officedepot-logo.jpeg", "percentage": 4, "values": ["25", "100"], "tags":"supplies, business"},
        {"key":"officemax", "name":"Office Max", "path": "img/officemax-giftcard.jpeg", "logo": "img/officemax-giftcard.jpeg", "percentage": 5, "values": ["25", "100"], "tags":"supplies, business"},
        {"key":"olivegarden", "name":"Olive Garden", "path": "img/olivegarden-giftcard.jpeg", "logo": "img/olivegarden-logo.jpg", "percentage": 9, "values": ["25"], "tags":"food, restaurant"},
        {"key":"outbacksteakhouse", "name":"Outback Steakhouse", "path": "img/outbacksteakhouse-giftcard.jpg", "logo": "img/outback-logo.jpeg", "percentage": 8, "values": ["25"], "tags":"food, restaurant"},
        {"key":"panera", "name":"Panera Bread Company", "path": "img/panera-giftcard.jpeg", "logo": "img/panera-logo.jpeg", "percentage": 9, "values": ["10", "25"], "tags":"food, restaurant"},
        {"key":"papajohns", "name":"Papa Johns Pizza", "path": "img/papajohns-giftcard.jpeg", "logo": "img/papajohns-giftcard.jpeg", "percentage": 8, "values": ["10"], "tags":"pizza, food"},
        {"key":"pietros", "name":"Pietros", "path": "img/pietros-giftcard.jpg", "logo": "img/pietros-giftcard.jpeg", "percentage": 10, "values": ["25"], "tags":"food, restaurant, local"},
//        {"key":"pizzahut", "name":"Pizza Hut", "path": "img/pizzahut-giftcard.JPG",  "logo": "img/pizzahut-logo.png", "percentage": 8, "values": ["25", "100"], "tags":"food, restaurant, pizza"},
//        {"key":"potterybarn", "name":"Pottery Barn", "path": "img/potterybarn-giftcard.jpeg", "logo": "img/potterybarn-logo.jpg",  "percentage": 8, "values": ["25", "100"], "tags":"home"},
        {"key":"paylesshoes", "name":"Payless Shoes", "path": "img/paylessshoes-giftcard.jpeg", "logo": "img/paylessshoes-giftcard.jpeg",  "percentage": 13, "values": ["25"], "tags":"shoes"},
//        {"key":"ocharleys", "name":"O'Charleys", "path": "img/ocharleys-giftcard.jpeg", "logo": "img/ocharleys-giftcard.jpeg",  "percentage": 13, "values": ["25"], "tags":"restaurant, food"},
        {"key":"qdoba", "name":"Qdoba", "path": "img/qdoba-giftcard.jpg", "logo": "img/qdoba-logo.jpeg", "percentage": 7, "values": ["25"], "tags":"food, restaurant"},
        {"key":"redlobster", "name":"Red Lobster", "path": "img/redlobster-giftcard.jpg", "logo": "img/redlobster-logo.jpeg", "percentage": 9, "values": ["25"], "tags":"food, restaurant"},
//        {"key":"regalentertainement", "name":"Regal Entertainment", "path": "img/regal-giftcard.jpeg", "logo": "img/regal-logo.jpg", "percentage": 8, "values": ["25"], "tags":"movies, fun"},
        {"key":"redrobin", "name":"Red Robin", "path": "img/redrobin-giftcard.jpeg", "logo": "img/redrobin-giftcard.jpeg", "percentage": 9, "values": ["25"], "tags":"restaurant, food, kids"},
        {"key":"rubytuesday", "name":"Ruby Tuesdays", "path": "img/rubytuesday-giftcard.jpg", "logo": "img/rubytuesday-logo.png", "percentage": 8, "values": ["25"], "tags":"food, restaurant"},
        {"key":"radioshack", "name":"Radio Shack", "path": "img/radioshack-giftcard.png", "logo": "img/radioshack-giftcard.png", "percentage": 4, "values": ["25"], "tags":"hobby, electronics"},
        {"key":"shopnsave", "name":"Shop n Save", "path": "img/shopnsave-giftcard.png", "logo": "img/shopnsave-giftcard.png", "percentage": 4, "values": ["25"], "tags":"food, groceries"},
        {"key":"sallybeauty", "name":"Sally Beauty", "path": "img/sallybeauty-giftcard.jpeg", "logo": "img/sallybeauty-giftcard.jpeg", "percentage": 12, "values": ["25"], "tags":"womens, beauty"},
        {"key":"sears", "name":"Sears", "path": "img/sears-giftcard.jpeg", "logo": "img/sears-giftcard.jpeg", "percentage": 4, "values": ["25", "100"], "tags":"clothing, applicances, mens, womens"},
        {"key":"shoecarnival", "name":"Shoe Carnival", "path": "img/shoecarnival-giftcard.jpeg", "logo": "img/shoecarnival-giftcard.jpeg", "percentage": 5, "values": ["25"], "tags":"shoes, mens, womens"},
        {"key":"sportsauthority", "name":"Sports Authority", "path": "img/sportsauthority-giftcard.jpeg", "logo": "img/sportsauthority-giftcard.jpeg", "percentage": 8, "values": ["25", "100"], "tags":"sports, clothes, clothing"},
        {"key":"steaknshake", "name":"Steak n Shake", "path": "img/steaknshake-giftcard.png", "logo": "img/steaknshake-logo.gif", "percentage": 8, "values": ["10"], "tags":"food, restaurant"},
        {"key":"sweettomatoes", "name":"Sweet Tomatoes", "path": "img/sweettomatos-giftcard.png", "logo": "img/sweettomatoes-giftcard.jpg", "percentage": 8, "values": ["25"], "tags":"food, restaurant, buffet"},
        {"key":"subway", "name":"Subway", "path": "img/subway-giftcard.png", "logo": "img/subway-logo.jpe", "percentage": 3, "values": ["10", "50"], "tags":"food, restaurant"},
        {"key":"tacobell", "name":"Taco Bell", "path": "img/tacobell-giftcard.jpg", "logo": "img/tacobell-logo.jpeg", "percentage": 5, "values": ["10"], "tags":"food, restaurant"},
        {"key":"target", "name":"Target", "path": "img/target-giftcard.jpg", "logo": "img/target-logo.jpeg", "percentage": 2, "values": ["25", "100"], "tags":"home"},
        {"key":"texasroadhouse", "name":"Texas Road House", "path": "img/texasroadhouse-giftcard.jpg", "logo": "img/texasroadhouse-logo.jpg", "percentage": 8, "values": ["25"], "tags":"food, restaurant"},
//        {"key":"tgifridays", "name":"TGI Fridays", "path": "img/tgifridays-giftcard.jpg", "logo": "img/tgifridays-logo.svg", "percentage": 9, "values": ["25"], "tags":"food, restaurant"},
        {"key":"thechildrensplace", "name":"The Childrens Place", "path": "img/thechildrensplace-giftcard.jpg", "logo": "img/thechildrensplace-giftcard.jpg", "percentage": 12, "values": ["25"], "tags":"kids, clothing, clothes"},
        {"key":"toysrus", "name":"Toys R Us", "path": "img/toysrus-giftcard.jpeg", "logo": "img/toysrus-logo.jpg", "percentage": 1.5, "values": ["20"], "tags":"toys, kids"},
        {"key":"walgreens", "name":"Walgreens", "path": "img/walgreens-giftcard.jpeg", "logo": "img/walgreens-logo.jpg", "percentage": 6, "values": ["25", "100"], "tags":"pharmacy"},
        {"key":"walmart", "name":"Walmart", "path": "img/walmart-giftcard.jpeg", "logo": "img/walmart-logo.jpeg", "percentage": 2.5, "values": ["25", "100", "250"], "tags":"home"},
        {"key":"wendys", "name":"Wendys", "path": "img/wendys-giftcard.jpg", "logo": "img/wendys-logo.jpg", "percentage": 4, "values": ["10"], "tags":"food, restaurant"},
//        {"key":"wholefoods", "name":"Whole Foods", "path": "img/wholefoods-giftcard.jpeg", "logo": "img/wholefoods-logo.jpeg", "percentage": 3, "values": ["25", "100"], "tags":"food, groceries"},
//        {"key":"williamssonoma", "name":"Williams Sonoma", "path": "img/williams-sonoma.jpg", "logo": "img/williamssonoma-logo.jpeg", "percentage": 8, "values": ["25", "100"], "tags":"home"},
//        {"key":"zappos", "name":"Zappos.com", "path": "img/zappos-giftcard.jpeg", "logo": "img/zappos-logo.jpeg", "percentage": 8, "values": ["25", "100"], "tags":"clothes, shoes"},
        {"key":"ugas", "name":"UGas", "path": "img/ugas-giftcard.jpg", "logo": "img/ugas-giftcard.jpg", "percentage": 1.5, "values": ["25", "100"], "tags":"gas, convenience"},
        {"key":"bpamoco", "name":"BP Amoco", "path": "img/bpamoco-giftcard.png", "logo": "img/bpamaco-giftcard.png", "percentage": 1.5, "values": ["50", "100"], "tags":"gas, convenience"},
        {"key":"mobil", "name":"Mobil", "path": "img/mobil-giftcard.png", "logo": "img/mobil-giftcard.png", "percentage": 1.5, "values": ["50"], "tags":"gas, convenience"},
        {"key":"dierbergs", "name":"Dierbergs", "path": "img/dierbergs.jpeg", "logo": "img/dierbergs.jpeg", "percentage": 5, "values": ["25", "100"], "tags":"groceries, food, local"},
        {"key":"savealot", "name":"Save a Lot", "path": "img/savealot-giftcard.jpeg", "logo": "img/savealot-giftcard.jpeg", "percentage": 5, "values": ["10"], "tags":"groceries, food, local"}

      ];

  return {
    findCard: function(name) {
      var findCardPromise = $q.defer();
      if (!giftcards) {
        $http.get('rest/cards.json').success(function(giftcards) {
          for (i = 0; i < giftcards.length; ++i) {
            if (name === giftcards[i].name || name === giftcards[i].key) {
              findCardPromise.resolve(giftcards[i]);
            }
          }
          findCardPromise.resolve({});
        }).error(function(data) { alert('error retrieving gift cards'); });
        return findCardPromise;
      }
      var i;
      for (i = 0; i < giftcards.length; ++i) {
        if (name === giftcards[i].name || name === giftcards[i].key) {
          findCardPromise.resolve(giftcards[i]);
        }
      }
      findCardPromise.resolve({});
      return findCardPromise;
    },
    allCards: function() {
      if (giftcards) { return giftcards; }
    }
  }
});

snapscripApp.factory('OrderService', function() {
  var completedOrder = {};
  return {
    'save': function(orderInformation) {
      completedOrder = orderInformation;
    },
    'completedOrder': function() {
      return completedOrder;
    }
  }
});


snapscripApp.factory('PdfService', function($http, $q, $filter) {
  var totalOrderAggregate = $filter('orderAggregate');
  var totalAggregate = $filter('totalAggregate');
  var instockFilter = $filter('isStockedFilter');
  function totalInstock(orderAggregation) {
    var total = 0;
    for (var i = 0; i < orderAggregation.length; i++) {
      if (instockFilter(orderAggregation[i].key)) {
        console.log(' total instock ' + orderAggregation[i].total);
        total = total + orderAggregation[i].total;
      }
    }
    return total;
  }
  function totalSpecialOrder(orderAggregation) {
    var total = 0;
    for (var i = 0; i < orderAggregation.length; i++) {
      if (!instockFilter(orderAggregation[i].key)) {
        total = total + orderAggregation[i].total;
      }
    }
    return total;
  }
  var mostRecent;
  var test = false;
  return {
    'testPdfs': function() {
        test = true;
    },
    'getPdf': function(orders) {
      var orderTotals = totalOrderAggregate(orders.orders);
      var pdfPromise = $q.defer();
      $http.get('rest/form.json').success(function(formData) {
        $http.get('rest/page_image_1.json').success(function(pageOneImage) {
          $http.get('rest/page_image_2.json').success(function(pageTwoImage) {
            var pageData1 = pageOneImage[0].path;
            var pageData2 = pageTwoImage[0].path;

            var pageOneCoords = formData[0].pages[0].fields;
            var pageTwoCoords = formData[0].pages[1].fields;

            var doc = new jsPDF();
            doc.addImage(pageData1, 'JPEG', 0, 0, 0, 0);
            doc.setFontSize(10);
            doc.text(73, 57, '' + orders.orderInformation.name); //order name
            doc.text(73, 62, '' + orders.orderInformation.phoneNumber); //order phone number
            doc.text(163, 57, '' + (new Date().getMonth() + 1)  + '-' + new Date().getDate() + '-' + new Date().getFullYear());
            var markRectoryPickup = orders.orderInformation.rectoryPickup ? 'X' : '';
            var markAfterMass = orders.orderInformation.afterMass ? 'X' : '';
            var markSendHome = orders.orderInformation.sendHome ? 'X' : '';
//            doc.text(117, 212, markRectoryPickup); // scrip-table
//            doc.text(117, 217, markAfterMass); // rectory
//            doc.text(117, 222, markSendHome); // child
//            doc.text(183, 222, '' + orders.orderInformation.childName); // child
//            doc.text(183, 229, '' + orders.orderInformation.homeroom); // homeroom
            doc.text(163, 250, '' + totalInstock(orderTotals));  //In Stock Total
            doc.text(163, 255, '' + totalSpecialOrder(orderTotals));  //Special Total
            doc.text(163, 263, '' + totalAggregate(orderTotals));  //Total
            doc.text(137, 271, '' + orders.orderInformation.checkNumber);  //Check Number
            doc.text(20, 20, 'printed by Snap-Scrip');
            for (var i = 0; i < pageOneCoords.length; i++) {
              var coords1 = pageOneCoords[i];
              var matchingOrderTotal = _.filter(orderTotals, function(order) { return order.key == coords1.key});
              console.log('Matching Order ' + matchingOrderTotal);
              if (matchingOrderTotal.length) {
                doc.text(parseInt(coords1.quantity.x), parseInt(coords1.quantity.y), '' + matchingOrderTotal[0].count);
                doc.text(parseInt(coords1.value.x), parseInt(coords1.value.y), '' + matchingOrderTotal[0].total);
                if (test) {
                  if (coords1.value.x > 100) {
                      doc.text(parseInt(coords1.value.x) - 90, parseInt(coords1.value.y), '' + matchingOrderTotal[0].key);
                  } else {
                    doc.text(5, parseInt(coords1.value.y), '' + matchingOrderTotal[0].key);
                  }
                }
              }
            }
            doc.addPage();
            doc.addImage(pageData2, 'JPEG', 0, 0, 0, 0);
            doc.setFontSize(10);
//          doc.text(128, 56, 'Special Order 1');
//          doc.text(164, 56, 'Value');
//          doc.text(181, 56, 'Qty');
//          doc.text(191, 56, 'Total');
//          doc.text(128, 61, 'Special Order 2');
//          doc.text(164, 61, 'Value');
//          doc.text(181, 61, 'Qty');
//          doc.text(191, 61, 'Total');
//          doc.text(128, 65, 'Special Order 3');
//          doc.text(164, 65, 'Value');
//          doc.text(181, 65, 'Qty');
//          doc.text(191, 65, 'Total');
//          doc.text(128, 69, 'Special Order 4');
//          doc.text(164, 68, 'Value');
//          doc.text(181, 69, 'Qty');
//          doc.text(191, 69, 'Total');
//          doc.text(128, 73, 'Special Order 5');
//          doc.text(164, 73, 'Value');
//          doc.text(181, 73, 'Qty');
//          doc.text(191, 73, 'Total');
//          doc.text(128, 77, 'Special Order 6');
//          doc.text(164, 77, 'Value');
//          doc.text(181, 77, 'Qty');
//          doc.text(191, 77, 'Total');
//          doc.text(128, 81, 'Special Order 7');
//          doc.text(164, 81, 'Value');
//          doc.text(181, 81, 'Qty');
//          doc.text(191, 81, 'Total');
//          doc.text(128, 86, 'Special Order 8');
//          doc.text(164, 86, 'Value');
//          doc.text(181, 86, 'Qty');
//          doc.rect(118, 200, 80, 40);
//          doc.text(120, 205, 'Payment Authorization:');
//          doc.text(120, 215, 'This payment was authorized by:');
//          doc.setFontStyle('bold');
//          doc.text(120, 220,  orders.orderInformation.name + ' at 2:22 PM on 3-9-2014');
//          doc.setFontStyle('normal');
//          doc.text(120, 225, 'Amount: $' + orders.orderInformation.checkNumber);
//          doc.text(120, 230, 'Check Number: ' + orders.orderInformation.checkNumber);
//          doc.text(120, 235, 'Routing Number: ' + orders.orderInformation.routingNumber);
//          doc.text(120, 240, 'Account Number: ' + orders.orderInformation.accountNumber);
            doc.text(120, 86, 'Total');
            doc.text(20, 20, 'printed by Snap-Scrip');
            for (var i = 0; i < pageTwoCoords.length; i++) {
              var coords2 = pageTwoCoords[i];
              var matchingOrderTotal = _.filter(orderTotals, function(order) { return order.key == coords2.key});
              if (matchingOrderTotal.length) {
                doc.text(parseInt(coords2.quantity.x), parseInt(coords2.quantity.y), '' + matchingOrderTotal[0].count);
                doc.text(parseInt(coords2.value.x), parseInt(coords2.value.y), '' + matchingOrderTotal[0].total);
                if (test) {
                  if (coords2.value.x > 100) {
                    doc.text(parseInt(coords2.value.x) - 90, parseInt(coords2.value.y), '' + matchingOrderTotal[0].key);
                  } else {
                    doc.text(5, parseInt(coords2.value.y), '' + matchingOrderTotal[0].key);
                  }
                }
              }
            }
            pdfPromise.resolve(doc);
//          doc.save('Test.pdf');
          });
        });

      }).error(function(data) {
        alert("error retrieving form data");
      });
      return pdfPromise;
    },
    'downloadCurrent': function() {
      mostRecent.save('123');
//      mostRecent.save(mostRecentOrderId);
    }
  }
});