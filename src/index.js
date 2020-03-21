const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const port = 8080;

function isProdEnv() {
  return process.env.NODE_ENV === 'production';
}

function domainName1() {
  return isProdEnv() ? 'privacy-sandbox-cookie-test.back2wild.com' : 'privacy-sandbox-cookie-test.zy2333.com';
}

function domainName2() {
  return isProdEnv() ? 'privacy-sandbox-cookie-test.back2wild.fun' : 'privacy-sandbox-cookie-test.zy2333.fun';
}


function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const templateCache = {};
function render(page, vars) {
  try {
    let template = templateCache[page];
    if (!template) {
      template = fs.readFileSync(path.resolve(__dirname, `templates/${page}.html`), { encoding: 'utf8' });
      templateCache[page] = template;
    }
    const allVars = Object.assign({}, { pageName: page }, (vars || {}));
    Object.keys(allVars).forEach((k) => {
      const v = allVars[k];
      const r = new RegExp(escapeRegExp(`{{${k}}}`), 'g');
      template = template.replace(r, `${v}`);
    })
    return template;
  } catch (ex) {
    return `ERROR: ${ex}`;
  }
}

function allowCors(req, res) {
  const origins = [
    'http://privacy-sandbox-cookie-test.back2wild.com',
    'https://privacy-sandbox-cookie-test.back2wild.com',
    'http://privacy-sandbox-cookie-test.back2wild.fun',
    'https://privacy-sandbox-cookie-test.back2wild.fun',
  ];
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin, // req.get('origin'),
    'Access-Control-Allow-Methods': 'DELETE, PUT, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  });
}

function disableCache(req, res) {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
}


app.options('*', (req, res) => {
  allowCors(req, res);
  res.end();
});


app.get('/', (req, res) => {
  allowCors(req, res);
  disableCache(req, res);
  res.set('Content-Type', 'text/html')
  res.send(render('home', {
    domainName1: domainName1(),
    domainName2: domainName2(),
  }));
});

app.get('/imgs/bicycle/:policy', (req, res) => {
  allowCors(req, res);
  disableCache(req, res);

  const p = req.params.policy;

  if (p === 'strict') {
    res.cookie('site1-bicycle-strict', 'ok', {
      // httpOnly: true,
      domain: `${domainName1()}`,
      maxAge: 3600000,
      sameSite: 'Strict',
      // secure: true,
    });
  } else if (p === 'lax') {
    res.cookie('site1-bicycle-lax', 'ok', {
      // httpOnly: true,
      domain: `${domainName1()}`,
      maxAge: 3600000,
      sameSite: 'Lax',
      // secure: true,
    });
  } else if (p === 'none') {
    res.cookie('site1-bicycle-none', 'ok', {
      // httpOnly: true,
      domain: `${domainName1()}`,
      maxAge: 3600000,
      sameSite: 'None',
      secure: true,
    });
  } else if (p === 'none-nonsecure') {
    res.cookie('site1-bicycle-none-non-secure', 'ok', {
      // httpOnly: true,
      domain: `${domainName1()}`,
      maxAge: 3600000,
      sameSite: 'None',
      // secure: true,
    });
  }
  res.sendFile(path.resolve(__dirname, 'imgs/bicycle.jpg'));
});

app.get('/css/bootstrap.min.css', (req, res) => {
  res.set('Cache-Control', 'max-age=10000000000');
  res.sendFile(path.resolve(__dirname, 'css/bootstrap.min.css'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
