const http = require('http');
const path = require('path');
const fs = require('fs');

// create the server
const server = http.createServer((req, res) => {
  //   console.log(req.url);
  // ******************************This stuff is for static pages.*****************************
  //
  //   if (req.url === '/') {
  //     fs.readFile(
  //       path.join(__dirname, 'public', 'index.html'),
  //       (err, content) => {
  //         if (err) throw 'Error reading file...';
  //         res.writeHead(200, { 'Content-Type': 'text/html' });
  //         res.end(content);
  //       }
  //     );
  //   }
  //   if (req.url === '/about.html') {
  //     fs.readFile(
  //       path.join(__dirname, 'public', 'about.html'),
  //       (err, content) => {
  //         if (err) throw 'Error reading file...';
  //         res.writeHead(200, { 'Content-Type': 'text/html' });
  //         res.end(content);
  //       }
  //     );
  //   }
  //   // Mimicking api request.
  //   if (req.url === '/api/users') {
  //     const users = [
  //       {
  //         name: 'Bob Smith',
  //         age: 20,
  //       },
  //       {
  //         name: 'Joey Fisher',
  //         age: 17,
  //       },
  //     ];
  //     // This is what you header you nneed for JSON data.
  //     res.writeHead(200, { 'Content-Type': 'application/json' });
  //     // How to send JSON response. Converts javascript object to json object.
  //     res.end(JSON.stringify(users));
  //   }
  //*********************End of static pages***************************
  //*******************Start of dynamic pages*************************** */

  //Build dynamic file path.
  let filePath = path.join(
    __dirname,
    path.extname(req.url) === '.css' ? '' : 'public',
    req.url === '/' ? 'index.html' : req.url
  );

  // Checking what filePath is.
  // console.log(filePath, ' ', req.url);

  // More common content-type is text/html
  let contentType = 'text/html';

  let extensionName = path.extname(filePath);

  // Check extension and set contentType
  switch (extensionName) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'type/css';
      // console.log('Extension name is css!');
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read correct file.
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // if error happens to be a page that doesn't exist. ENOENT = Error No Entry.
      if (err.code === 'ENOENT') {
        fs.readFile(
          path.join(__dirname, 'public', '404error.html'),
          (err, content) => {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
          }
        );
      } else {
        // Server Error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success. Found html file.
      // console.log('Success: ', contentType);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

// process is an environment variable.
const PORT = process.env.PORT || 5000;

// Set the server to listen to a particular port.
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
