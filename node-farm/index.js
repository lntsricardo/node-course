const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((p) => slugify(p.productName, { lower: true }));

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  // OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    response.end(output);

    // PRODUCT
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.writeHead(200, {
      'Content-Type': 'text/html',
    });
    response.end(output);

    // API
  } else if (pathname === '/api') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(data);

    //NOT FOUND
  } else {
    response.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'error',
    });
    response.end('Page not found');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening...');
});
