const {test, expect} = require('@playwright/test');

test('test login functionality',async({page})=>{

    await page.goto("https://qa-app-06.qventus.com/login?next=/");
    console.log(page.title());
    await page.getByPlaceholder('Username or Email Address').fill("clinicscheduler-qa");
    await page.locator('input[name="password"]').fill("password1");
    await page.locator("button[type='submit']").click();
    await page.waitForLoadState('networkidle');
    await page.locator("//span[contains(text(),'TIMEFINDER')]").click();
    await page.locator("#case_name").fill("Siddharth");
    await page.locator("span.ant-input-suffix").first().click();
    await page.locator("//div[contains(text(),'daniel ricciardo')]").click();
    await page.locator("//button[@aria-label='open-calendar-button']").click();
    await page.getByPlaceholder("Start date").click();
    let dates=await page.$$("//div[@role='presentation'] //div[@role='row'] //div");
   for(let date of dates){
        let dateText=await date.textContent();
        if(dateText.trim()==15){
            await date.click();
            break;
        }
    }

    // await page.locator("//button[contains(text(),'13')]").first().click();
    await page.getByPlaceholder("End date").click();
    for(let date of dates){
        let dateText=await date.textContent();
        if(dateText.trim()==20){
            await date.click();
            break;
        }
    }
    // await page.locator("button[aria-label='calendar-day-29']").click();
    await page.locator("span.ant-input-suffix").nth(1).click();
    await page.locator("div.css-ybi8kr").nth(1).click();
    await page.getByLabel("Duration").fill("30");
    await page.locator("button[data-testid=slotsearchform-submit]").click();
    
});