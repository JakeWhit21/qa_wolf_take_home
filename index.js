// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { log } = require("console");
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // const locator = page.locator('#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td.subtext > span > span.age');
  // const moreThanTen = await locator.evaluateAll((divs) => divs);

  // const divCounts = await page.$$eval('div', (divs, min) => divs.length >= min, 10);
  
// console.log(moreThanTen);

let articles = [];

  // Loop to collect 100 articles across multiple pages
  while (articles.length < 100) {
    // Evaluate articles using locator.evaluateAll
    const newArticles = await page.locator('.athing').evaluateAll((articleNodes) => {
      return articleNodes.map((article) => {
        const id = article.id;
        const ageElement = article.nextElementSibling.querySelector('.age');
        const age = ageElement ? ageElement.innerText : null;
        return { id, age };
      });
    });

    articles.push(...newArticles);

    if (articles.length >= 100) {
      articles = articles.slice(0, 100);
      break;
    }

    // Click "More" to load next page
    await Promise.all([
      page.waitForURL("**/newest*"),
      page.click('a.morelink')
    ]);
  }

  // Validate sorting
  const sortedArticles = [...articles].sort((a, b) => {
    // Implement proper date parsing here
    // For example purposes, assume 'age' is in a comparable format
    const dateA = new Date(a.age);
    const dateB = new Date(b.age);
    return dateB - dateA;
  });

  const isSorted = JSON.stringify(articles) === JSON.stringify(sortedArticles);

  console.log(`Are the articles sorted from newest to oldest? ${isSorted}`);
  
  await browser.close();
}



(async () => {
  await sortHackerNewsArticles();
})();
