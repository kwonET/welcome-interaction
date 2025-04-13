// var SerialPort = require("serialport").SerialPort;
var SerialPort = require("serialport").SerialPort;
const http = require("http");
const fs = require("fs");
const socketIO = require("socket.io");
const path = require("path");

const serialPort = new SerialPort(
  { path: "/dev/cu.usbserial-14130", baudRate: 9600 },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
    console.log("Connected...");
    startServer();
  }
);

// 웹 소켓 서버 생성
const server = http.createServer(function (req, res) {
  const filePath = req.url === "/" ? "index.html" : req.url.slice(1);

  // const filePath = req.url;
  // 파일 확장자에 따라 Content-Type을 설정
  const contentType = getContentType(filePath);
  // 파일을 읽어 응답으로 전송
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

function getContentType(filePath) {
  // 파일 확장자를 기반으로 Content-Type을 반환
  const extname = path.extname(filePath);
  switch (extname) {
    case ".js":
      return "application/javascript";
    case ".html":
      return "text/html";
    default:
      return "text/plain"; // 다른 확장자에 대한 기본값 설정
  }
}

const io = socketIO(server);
io.on("connection", function (socket) {
  console.log("a user connected");
});
serialPort.on("data", function (data) {
  console.log("Data received: " + data);
  const textDecoder = new TextDecoder("utf-8");
  const decodedData = textDecoder.decode(data);
  // 웹 소켓을 통해 클라이언트에 데이터를 전송
  io.emit("serialData", decodedData);
});
function startServer() {
  const port = 5173;
  server.listen(port, function () {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
