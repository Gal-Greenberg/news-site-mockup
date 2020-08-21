const http = require('http');
const url = require("url");

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;

    path = path.replace(/^\/+|\/+$/g, "");
    let qs = parsedURL.query;
    let headers = req.headers;
    let method = req.method.toLowerCase();

    let body = '';
    req.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        let route = typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
        let data = {
            path: path,
            queryString: qs,
            headers: headers,
            method: method,
            body: body
        };
        route(data, res);
      });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const routes = {
    contentCreator: (data, res) => {
        let bodyParse = JSON.parse(data.body);

        // console.log(bodyParse);
        // console.log(bodyParse.title);
        // console.log(bodyParse.subtitle);
        // console.log(bodyParse.content);
        // console.log(bodyParse.from);

        // console.log(data.queryString.mail);

        let payload = {
          message: "",
          code: 0
        };
        
        if (bodyParse.title == undefined || bodyParse.title == "") {
          payload.message += "חובה למלא כותרת לכתבה\n";
          payload.code = 500;
        }
        if (bodyParse.subtitle == undefined || bodyParse.subtitle == "") {
          payload.message += "חובה למלא תת כותרת לכתבה\n";
          payload.code = 500;
        }
        if (bodyParse.content == undefined || bodyParse.content == "") {
          payload.message += "חובה למלא תוכן לכתבה\n";
          payload.code = 500;
        }
        if (bodyParse.from == undefined || bodyParse.from == "") {
          payload.message += "חובה למלא מי כותב הכתבה\n";
          payload.code = 500;
        }
        if (payload.code == 0) {
          payload.message = "הצלחה";
          payload.code = 200;//Math.round(Math.random());
        }

        let payloadStr = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(payload.code);

        res.write(payloadStr);
        res.end("\n");
    }
}