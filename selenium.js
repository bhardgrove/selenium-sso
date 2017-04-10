/**
 *  This script will open the ReportCenter SSO URL and capture the login name,
 *  take a screenshot, and then logout.  A screenshots directory is filled with
 *  files which name contains the lastname and epoch timestamp.
 *  <code>node selenium.js 100</code> will run the test 100 times
 */

var fs = require('fs');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var execNumber = process.argv[2];
var driver = new webdriver.Builder()
   .forBrowser('chrome')
   .build();

function ssoTester(url, server) {
   driver.get(url);
   driver.findElement( webdriver.By.className("titlebarSignInInfo") )
        .getText()
        .then(function(txt) {
               txt = txt.replace(/Welcome, /g, "");
               txt = txt.replace(/ReportCenter/g, "");
               txt = txt.replace(/\(\)/g, "");
               txt = txt.replace(/,/g, "");
               name = txt.split(" ");
        });

   driver.takeScreenshot().then(function(data){
      var base64Data = data.replace(/^data:image\/png;base64,/,"")
      var date = new Date().valueOf();

      fs.writeFile('screenshots/' + name[0] + "_" + date + "_" + server + "_screenshot.png",
                   base64Data, 'base64', function(err) {
                       if(err) console.log(err);
      });
  });

  currentUrl = driver.getCurrentUrl()
                     .then(function (title) {
                         title = title.match(/server(\d)/);
                         console.log(title);
                         driver.get('https://' + title[0]  + '.url.net:8443/r2w/signOut.do');
  });
}

for (var i = 0; i < execNumber; i++) {
      ssoTester('http://url1', 'name1');
      ssoTester('http://url2', 'name2');
      ssoTester('http://url3', 'name3');
}

driver.quit();
