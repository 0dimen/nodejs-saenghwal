var http = require('http'); // http를 import 한다.
var fs = require('fs'); // fs를 import 한다.
var url = require('url');

var app = http.createServer(async function(req, res){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    
    if(pathName === '/'){
        var title = queryData.id;
        var description;
    
        var list = "<ul>";
        const files = await fs.readdirSync('./data');
        files.forEach(f=>{
            list += `<li><a href="/?id=${f}">${f}</a></li>`;
        })

        list += "</ul>";

        if(queryData.id === undefined){
            title = 'Welcome';
            description = 'Hello, Node.js';
        }
        else{
            fs.readFileSync(`data/${title}`, 'utf8', function(err, data){
                description = data;
            });
        }
        
        var template = `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
        </body>
        </html>
        `;
        res.writeHead(200);
        res.end(template);
        
    } else{
        res.writeHead(404);
        res.end('Not found');
    }

});

app.listen(3000); // 3000번 포트로 서버를 열어준다.
console.log(`Server is running at http://localhost:3000`); // 서버가 열렸다는 메시지를 출력한다.