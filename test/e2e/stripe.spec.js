'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  describe('home page', function() {
    var driver;

    beforeEach(function() {
      browser.get('/#/home');
      driver = browser.driver;
    })

    it('lets start out at home', function() {
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/home");
    });

    it('successful transaction should land you on the confirmation page', function() {
      element(by.id("amazon")).click();
      element(by.id("add25")).click();
      element(by.id("checkoutButton")).click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/order");
      element(by.id("creditcard")).click();
      element(by.id("reviewOrderButton")).click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/review");
      element(by.id("completeOrderButton")).click();
      var waitPromise = driver.wait(function() {
        if (driver.isElementPresent(protractor.By.name('stripe_checkout_app'))) {
          driver.switchTo().frame(driver.findElement(protractor.By.name('stripe_checkout_app')));
          var loaded = driver.isElementPresent(protractor.By.css(".name"));
          driver.switchTo().defaultContent();
          return loaded;
        }
        return false;
      }, 3000);
      waitPromise.then(function() {
        // fill in form data
        submitPaymentForm(driver);
        driver.findElement(protractor.By.id("card_number")).sendKeys("4242 4242 4242 4242");
        driver.findElement(protractor.By.css(".cvcInput")).sendKeys("345");
        driver.findElement(protractor.By.css(".expiresInput")).sendKeys("0119");
        driver.findElement(protractor.By.css('button')).click();
        var counter = 0;
        var waitPromise = driver.wait(function() {
            counter++;
            if (counter > 500) {
              return true;
            }
            return false;
        }).then(function() {
            //verify
            driver.switchTo().defaultContent();
            browser.waitForAngular();
            expect(browser.getCurrentUrl()).toBe("http://localhost:8018/#/confirmation");
        });


      });
    });

    function submitPaymentForm(driver) {
      driver.switchTo().frame(driver.findElement(protractor.By.name('stripe_checkout_app')));
      driver.findElement(protractor.By.id("email")).sendKeys("mennecoupons@gmail.com");
      driver.findElement(protractor.By.css(".name")).sendKeys("Mike Menne");
      driver.findElement(protractor.By.css(".street")).sendKeys("5000 Tholozan");
      driver.findElement(protractor.By.id("billing-zip")).sendKeys("63139");
      driver.findElement(protractor.By.css(".city")).sendKeys("Saint Louis");
      driver.findElement(protractor.By.css('button')).click();
    }

  });
});
