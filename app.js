const formidable = require('formidable');
const http = require('http');
const fs = require('fs');

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
        res.write('File uploaded and moved! <a href="/">Go back!</a>');
        res.end();
      })
    });
  }else{
    res.writeHead(200,{
      'Content-Type':'text/html'
    });
    res.write(`
      <form action="fileupload" method="post" enctype="multipart/form-data">
        <input type="file" name="filetoupload"/><br>
        <input type="submit"/>
      </form>
    `);
    return res.end();
  }
}).listen(3111);
