var http = require('http'); // http를 import 한다.
var fs = require('fs'); // fs를 import 한다.
var url = require('url');
var qs = require('querystring');

function templateHTML (title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB2</a></h1>
        ${templateList(list)}
        ${body}
        
    </body>
    </html>
    `;
}

function templateList(fileList){
    var list = "<ul>";
    fileList.forEach(f=>{
        list += `<li><a href="/?id=${f}">${f}</a></li>`;
    })
    list += "</ul>";
    return list;
}

var app = http.createServer(async function(req, res){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    
    
    if(pathName === '/'){
        const files = fs.readdirSync('./data');
        var title = queryData.id;

        // 파일 값 가져오기
        if(queryData.id === undefined){
            title = 'Welcome';
            description = 'Hello, Node.js';
        }
        else{
            try{
                description = fs.readFileSync(`data/${title}`, 'utf8');
            }catch(err){
                
            }
        }

        // 템플릿 생성
        var template = templateHTML(title, files, `
            <h2>${title}</h2>
            <p>${description}</p>
            <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>`);
        
        res.writeHead(200);
        res.end(template);
        
    } 
    else if(pathName ==='/create'){
        const files = fs.readdirSync('./data');
        var title = 'Create';
        var body = `
        <form action="http://localhost:3000/create_process" method="post">
            <p><input type = "text" name = "title" palceholder = "title"></p>
            <p><textarea name = "description" placeholder = "description"></textarea></p>
            <p><input type = "submit"></p>
        </form>
        `
        var template = templateHTML(title, files, body);
        res.writeHead(200);
        res.end(template);
    }
    else if(pathName === '/create_process'){
        var body = '';
        req.on('data', function(data){
            body += data;
        });
        req.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                res.writeHead(302, {Location: `/?id=${title}`});
                res.end();
            });
        });
    }
    else{
        res.writeHead(404);
        res.end('Not found');
    }

});

app.listen(3000); // 3000번 포트로 서버를 열어준다.
console.log(`Server is running at http://localhost:3000`); // 서버가 열렸다는 메시지를 출력한다. 