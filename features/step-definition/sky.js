const { Given, When, Then, Before, After } = require('@cucumber/cucumber')
const { assert, expect } = require('chai')
//var assert = require('assert');
const webdriver = require('selenium-webdriver');
const { Builder, By, Key, until } = require('selenium-webdriver');

var { setDefaultTimeout } = require('@cucumber/cucumber');

//site was taking upto 120 sec to resolve, so set timeout accourdingly to prevent error with promise resolution
setDefaultTimeout(2 * 60 * 1000);

let driver;

let skyHomePage = 'https://www.sky.com/';
let skyDealsPage = 'https://www.sky.com/deals';

Before(function () {
    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
});

Given('I am on the home page', async function () {
    await driver.get(skyHomePage);

    await driver.manage().window().maximize();

    await agreeConsent();

});

When('I navigate to {string}', async function (linkName) {

    await driver.switchTo().defaultContent();

    await driver.sleep(5000);

    //await printPageSource();

    await driver.wait(until.elementLocated(By.xpath('//a[contains(text(),"Deals")]')), 5000);

    await driver.findElement(By.xpath('//a[contains(text(),"Deals")]')).click();

});

Then('the user should be on the {string} page', async function (dealPageUrl) {
    let currentUrl = await driver.getCurrentUrl();
    //console.log(currentUrl);
    expect(currentUrl).to.contain(dealPageUrl);
});

When('I try to sign in with invalid credentials', async function () {

    await driver.switchTo().defaultContent();

    await driver.sleep(5000);

    await driver.findElement(By.xpath('//a[contains(text(),"Sign in")]')).click();

    await driver.wait(
        until.ableToSwitchToFrame(By.xpath('//iframe[@title="iFrame containing Sky Sign-In application"]')), 10000, 'could not find the iframe'
    );

    await driver.findElement(By.id('username')).sendKeys('xxx@yyy.com');
    let continueButton = driver.findElement(By.xpath('//*[@id="app-component"]//button'));

    await driver.wait(
        until.elementIsEnabled(continueButton), 1000, 'button is not enabled'
    );

    continueButton.click();

});


Then('I should see a box with the text {string}', async function (createPassText) {

    await driver.switchTo().defaultContent();
    await driver.sleep(5000);
    let iframeScreen = driver.findElement(By.xpath('//iframe[@title="iFrame containing Sky Sign-In application"]'));
    await driver.wait(
        until.ableToSwitchToFrame(iframeScreen), 10000, 'could not find the iframe');

    //await printPageSource();

    await driver.findElement(By.xpath("//div[@id='root']//h1")).getText().then((screenCreateYourPassText) => {
        assert.equal(createPassText, screenCreateYourPassText)
    });

});


Given('I am on the {string} page', async function (dealsUrl) {

    //did not use input var - dealsUrl as it seemed to be differen than actual

    await driver.get(skyDealsPage);
    await driver.manage().window().maximize();
    await agreeConsent();
});


Then('I see a list of deals with a price to it', async function (dataTable) {

    //console.log(dataTable.raw()[0][0]);

    await driver.switchTo().defaultContent();

    const element = await driver.findElement(By.xpath("//section[@id='deals']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", element)
    await driver.sleep(2000);

    let dealsContainer = await driver.findElement(By.xpath("//section[@id='deals']/div/div"));

    //price array to hold value from screen
    let pricesFromScreen = [];

    //find container element and then loop within for each deal / price
    await dealsContainer.findElements(By.xpath("//span[starts-with(@id,'price')]")).then(async (priceElements) => {
        //console.log(priceElements.length);
        await priceElements.forEach(async function (p) {
            let text = await p.getText();
            //extract only number part for assertion
            text = text.replace(/[^0-9]/g, '');
            await pricesFromScreen.push(text);
        });
    }
    );

    //iterate on datatable values provided through feature file and check if each of values exists within array constructed above using values from screen
    await dataTable.raw().forEach(async function (row) {
        expect(pricesFromScreen.includes(row[0])).to.be.true;
    });
});

When('I search {string} in the search bar', async function (searchTerm) {
    await driver.switchTo().defaultContent();

    await driver.sleep(5000);

    //await printPageSource();

    await driver.wait(until.elementLocated(By.xpath('//button[@id="masthead-search-toggle"]')), 5000);
    await driver.findElement(By.xpath('//button[@id="masthead-search-toggle"]')).click();

    let el = await driver.findElement(By.xpath('//input[@type="search"]'));
    await driver.wait(until.elementIsVisible(el), 5000);
    await el.sendKeys(searchTerm);

});

Then('I should see an editorial section.', async function () {
    await driver.sleep(2000);

    let editorial = await driver.findElement(By.xpath("//div[@data-test-id='editorial-section']"));
    await driver.wait(until.elementIsVisible(editorial), 5000);
    await assert.notEqual(editorial, null);
});

async function printPageSource() {
    await driver.getPageSource().then((value) => { console.log(value) })
}

async function agreeConsent() {

    //we can extract id and xpath and pass it from calling method, however as its same for now, kept it as is
    await driver.wait(
        until.ableToSwitchToFrame(By.id('sp_message_iframe_474555')),
        1000,
        'Could not locate the editor iFrame.'
    );
    //await printPageSource();
    await driver.findElement(By.xpath('//button[@title="Agree"]')).click();
}

After(function () {
    driver.quit();
});