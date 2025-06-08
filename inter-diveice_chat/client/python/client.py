import socket
import time
import json
import threading

myname = input('이름을 입력하세요')

def recvData(sock):
    """서버로부터 메시지를 수신합니다."""
    while True:
        try:
            data = sock.recv(1024)
            if not data:
                print("서버와의 연결이 끊겼습니다.")
                break
            data = json.loads(data.decode('utf-8'))
            print(f"[{data['from']}] {data['msg']}")
            
        except Exception as e:
            print(f"오류 발생: {e}")
            break
        
    sock.close()

def sendData(sock, myname):
    """서버로 메시지를 전송합니다."""
    while True:
        msg = input()
        if msg.lower() == "exit":
            data = {'kind': 'Disconnect', 'from': myname, 'to': '#', 'msg': f"{myname}님이 접속을 종료합니다."}
            sock.send(json.dumps(data).encode('utf-8'))
            time.sleep(0.05)
            print("접속을 종료합니다")
            break
        data = {'kind': 'Msg', 'from': myname, 'to': '#', 'msg': msg}
        sock.send(json.dumps(data).encode('utf-8'))
    sock.close()


host, port = '127.0.0.1', 9010
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((host, port))

join_msg = {'kind': 'Join', 'from': myname, 'to': '#', 'msg': f"{myname}님이 접속했습니다."}
client_socket.send(json.dumps(join_msg).encode('utf-8'))

recv_thread = threading.Thread(target=recvData, args=(client_socket,))
recv_thread.start()

send_thread = threading.Thread(target=sendData, args=(client_socket, myname))
send_thread.start()

send_thread.join()
recv_thread.join()
