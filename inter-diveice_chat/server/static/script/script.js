const form = document.getElementById('chat-form');
const message_input = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');

let user = '';
while (!user || user.trim().length < 2) {
  user = prompt('사용자 이름을 입력해주세요 (2자 이상)');
}
alert(`${user}님 환영합니다!`);

function addMessage(msg, from) {
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.textContent = from + ': ' + msg;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

const webSocket = new WebSocket('ws://localhost:9020');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const message = message_input.value;
  if (message !== '') {
    // addMessage(message, '나');

    webSocket.send(JSON.stringify({
      kind: 'Msg',
      from: user,
      msg: message
    }));

    message_input.value = '';
  }
});

webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if(data.from == user){data.from = '나'} 

  addMessage(data.msg, data.from);
}

// webSocket.addEventListener('message', (input) => {
// // 혹은 webSocket.onmessage = () =>{}
//   const {from, msg} = JSON.parse(input);

//   addMessage(from, msg);
// });

webSocket.onopen = () => {
  console.log('web socket is open');
  webSocket.send(JSON.stringify({
    kind: 'Join',
    from: user,
    msg: '님이 접속하셨습니다'
  }));
}

function leave(){
  if (webSocket.readyState === WebSocket.OPEN) {
    webSocket.send(JSON.stringify({
      kind: 'Disconnect',
      from: user,
      msg: '님이 나가셨습니다'
    }));
    webSocket.close();
  }

  alert('종료되었습니다');
}

window.addEventListener('beforeunload', (e) => {
  leave();
});
