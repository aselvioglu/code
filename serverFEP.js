const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '';

  if (req.url === '/homepageFEP.html') {
    filePath = path.join(__dirname, 'homepageFEP.html');
  } else if (req.url === '/homePageMembers') {
    filePath = path.join(__dirname, 'homePageFEPMembers.html');
  } else if (req.url === '/signup.html') {
    filePath = path.join(__dirname, 'signup.html');
  }else if (req.url === '/login.html') {
    filePath = path.join(__dirname, 'login.html');
  }else if (req.url === '/learnContribute.html') {
    filePath = path.join(__dirname, 'learnContribute.html');
  }else if (req.url === '/howtoMembers.html') {
    filePath = path.join(__dirname, 'howtoMembers.html');
  }else if (req.url === '/Howto.html') {
    filePath = path.join(__dirname, 'Howto.html');
  }else if (req.url === '/forgetPassword.html') {
    filePath = path.join(__dirname, 'forgetPassword.html');
  }else if (req.url === '/design.html') {
    filePath = path.join(__dirname, 'design.html');
  }else if (req.url === '/dashboard.html') {
    filePath = path.join(__dirname, 'dashboard.html');
  }else if (req.url === '/create.html') {
    filePath = path.join(__dirname, 'create.html');
  }else if (req.url === '/Communicate.html') {
    filePath = path.join(__dirname, 'Communicate.html');
  }else if (req.url === '/communicateMembers.html') {
    filePath = path.join(__dirname, 'communicateMembers.html');
  }else if (req.url === '/About.html') {
    filePath = path.join(__dirname, 'About.html');
  }else if (req.url === '/comment.html') {
    filePath = path.join(__dirname, 'comment.html');
  }else if (req.url === '/aboutMembers.html') {
    filePath = path.join(__dirname, 'aboutMembers.html');
  } else {
    // If the requested URL is not /nonmember, /member, or /signup.html, serve a 404 page
    filePath = path.join(__dirname, '404.html');
  }
  

  // Read the HTML file and serve it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If there's an error reading the file, serve a 500 error page
      res.writeHead(500);
      res.end('Server Error');
    } else {
      // Set the content type based on the file extension
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      if (ext === '.css') {
        contentType = 'text/css';
      }

      // Set the appropriate content type header and serve the file data
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
