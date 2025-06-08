const net = require('net');
const WebSocket = require('ws');
// const websock = require('./websock');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('./static'));

const net_port = 9010;
const ws_port = 9020;
let net_clients = [];
let ws_clients = [];
let users = [];

//###############
//send to clients-----------------------------------------------------------------------------------
//###############

function sendAllClients(data) {
    sendWsClients(data);
    sendNetClients(data);
}

async function sendWsClients(data) {
    ws_clients.forEach(client => {
        client.send(JSON.stringify(data));
    });
}

async function sendNetClients(data) {
    net_clients.forEach((client) => {
        client.write(JSON.stringify(data));
        
        // if(data.to == '#') {
        // }
        // else{
        //     data.msg = data.msg + '(귓말)';
        //     if(client === data.to){
        //         client.write(JSON.stringify(data));
        //     }
        // }
    });
}

//################
//websocket server----------------------------------------------------------------------------------
//################

const server = app.listen(ws_port, () => {
    console.log('ws server started');
});

const ws_server = new WebSocket.Server({server});
    
ws_server.on('connection', (ws) => {
    ws_clients.push(ws);

    ws.on('close', () => {
        sendAllClients({
            kind: 'Disconnect',
            from: '나',
            to: '#',
            msg: '님이 접속을 종료했습니다.'
        });
  
        ws_clients = ws_clients.filter(v => v !== ws);//wsClient에서 제거
    });

    ws.on('message', (input) => {
        const data = JSON.parse(input);
        console.log(`[${data.from}] ${data.kind}: ${data.msg}`);

        switch(data.kind){
            case 'Msg':
                // console.log(ws_clients);
                sendAllClients(data); break;

            case 'Join':
                sendAllClients({
                    from: data.from,
                    msg: data.msg
                }); break;
            
            case 'Disconnect':
                sendAllClients({
                    from: data.from,
                    to: '#',
                    msg: data.msg
                }); break;
        }
    });
});

//##########
//net server----------------------------------------------------------------------------------------
//##########

const net_server = net.createServer((client) => {
    client.setEncoding('utf8');
    
    client.on('data', (dataInput) => {
        const data = JSON.parse(dataInput);
        console.log(`[${data.from}] ${data.kind}: ${data.msg}`);
        
        if(data.kind == "Disconnect"){
            sendAllClients({
                from: data.from,
                to: '#',
                msg: "님이 연결을 종료하였습니다."
            });
        }
        
        if(data.kind == "Join"){
            net_clients.push(client);
            users.push(data.from);
            
            sendAllClients({
                from: data.from,
                to: '#',
                msg: "님이 접속하였습니다.",
            });
        }
        
        if(data.kind == "Msg"){
            sendAllClients({
                from: data.from,
                to: data.to,
                msg: data.msg,
            });
        }
        
        
    });
    
    client.on('error', (err) => {})
});

net_server.on('error', (err) => {
    console.log(err);
})

net_server.listen(net_port, () => {
    console.log('net server started');
    
    server.on('close', () => {
        console.log('net server closed');
    })
});