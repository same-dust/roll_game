const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const id=[];
let connectedClients=0;
const app = createServer();
app.on("request", (req, res) => {
    if (req.url === "/style.css") {
        // Serve CSS file
        fs.readFile("./style.css", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        });
    } else if (req.url === "/script.js") {
        // Serve JS file
        fs.readFile("./script.js", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(data);
        });
    }else if (req.url === "/image/game.png") {
        // Serve game.png
        fs.readFile("./image/game.png", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(data);
        });
    } else if(req.url==="/image/index.png"){
        fs.readFile('./image/index.png',(err,data)=>{
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(data);
        })
    } 
    else if (req.url === "/") {
        // Serve HTML file
        fs.readFile("./index.html", (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else {
        res.writeHead(404);
        res.end("Not found");
    }
});

const io = new Server(app, { /* options */ });
// 监听用户连接的事件
// socket表示用户的连接
// socket.emit 表示触发某个事件
// socket.on 表示注册某个事件

io.on("connection", (socket) => {
    if(connectedClients<2){
        connectedClients++;
        console.log("a user connected");
        id.push(socket.id);
        console.log(socket.id);

        socket.on('disconnect',()=>{
            id.pop(socket.id);
            console.log("a user disconnected");
            connectedClients--;
        })
        socket.on('start',(data)=>{
            // console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('start',data);
                }
            }
        })

        socket.on('roll',(data)=>{
            // console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('roll',data);
                        }
                    }
        })
        socket.on('lock-dice',(data)=>{
            // console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('lock-dice',data);
                        }
                    }
        })
        socket.on('locked',(data)=>{
            // console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('locked',data);
                        }
                    }
        })
        socket.on('confirm1',(data)=>{
            console.log('o1');
            console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('confirm1',data);
                        }
                    }
        })
        socket.on('confirm2',(data)=>{
            console.log('o2');
            console.log(data);
            for(let i=0;i<id.length;i++){
                if(id[i]!==socket.id){
                    io.to(id[i]).emit('confirm2',data);
                        }
                    }
        })
    }
    else{
        console.log("room is full");
        socket.disconnect();
    }
    

});

app.listen(3000,()=>{
    console.log("server is running at port 3000")
});


// const count = io.engine.clientsCount; 获取客户端数量，达到两个即可开启对战
// // make all Socket instances join the "room1" room
// io.socketsJoin("room1");