const net = require('net');
const express = require('express');
const app = express();

const net_port = 9010;
const web_port = 9020;

const sock = net.connect({port: net_port, host: 'localhost'});
app.use(express.static('static'));
app.use(express.json());

//---------web

app.post('/', (req, res) => {//data send
    const {user, message} = req.body;
    const data = {
        kind: "Msg",
        from: user,
        to: '#',//나중에 귓말 기능 추가
        msg: message
    }

    sock.write(JSON.stringify(data));

    res.status(200);
});

app.listen(web_port, () => {
    console.log('running idk');
})

//---------python
sock.on("connect", () => {
    console.log('connected')
    sock.write(JSON.stringify({
        kind: 'Join',
        from: 'web user',
        to: '#',
        msg: 'unknown is connected'
    }));
});

sock.on('data', (dataInput) => {
    const data = JSON.parse(dataInput);
    console.log(`[${data.from}] ${data.kind}: ${data.msg}`);
})

sock.on('error', () => {
    sock.write(JSON.stringify({
        kind: 'Disconnect',
        from: 'unknown',
        to: '#',
        msg: 'unknown is disconnected'
    }));
})