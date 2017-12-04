const formidable = require('formidable');
const http = require('http');
const fs = require('fs');
const path = require('path');

var directoryPath = path.join(__dirname,"mailbox");

var items = [];

fs.readdir(directoryPath,(err,files) => {
  if (err){
    return console.log('Error scanning directory: '+ directoryPath);
  }(
  files.forEach((file) => {
    if(! /^\..*/.test(file)) {
      items.push(file);
    }
  }))
});

http.createServer((req,res) => {
  res.writeHead(200,{
    'Content-Type':'text/html'
  });
  if(req.url == "/fileupload"){
    var form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
      var oldpath = files.filetoupload.path;
      var newpath = './mailbox/' + files.filetoupload.name;
      fs.rename(oldpath,newpath,(err) => {
        if (err) throw err;
        res.write('File uploaded and moved! <a href="/">Go back!</a> <a href="/mailbox">Go to mailbox</a>');
        res.end();
      })
    });
  } else if (req.url == "/mailbox") {
    res.writeHead(200,{
      'Content-Type':'text/html'
    });
    fs.readFile('./mailbox.html',(err,data) => {
      var filesString = '';
      if (err){
        res.writeHead(404,{
          'Content-Type':'text/plain'
        });
        res.write('404 Page not found!');
      }
      for (var i = 0; i < items.length; i++) {
        filesString = filesString + '<li>' + items[i] + '</li>';
        res.write(data + filesString + '</ul></body></html>');
      }
      res.end();
    });
  } else{
    res.writeHead(200,{
      'Content-Type':'text/html'
    });
    res.write(`
      <form action="fileupload" method="post" enctype="multipart/form-data">
        <input type="file" name="filetoupload"/><br>
        <input type="submit"/>
      </form>`);
    return res.end();
  }
}).listen(3111);
