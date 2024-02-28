import websocket
import json
try:
    import thread
except ImportError:
    import _thread as thread
import time

def on_message(ws, message):
    print("Received message:")
    print(message)

def on_error(ws, error):
    print("Error:")
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        # 여기에 보내고 싶은 메시지 시퀀스를 정의합니다.
        messages_to_send = [
            {"type": "greeting", "content": "Hello, server!"},
            {"type": "question", "content": "How are you?"},
        ]
        for message in messages_to_send:
            ws.send(json.dumps(message))
            time.sleep(1)  # 서버로부터의 응답을 기다립니다.
        time.sleep(1)  # 모든 메시지를 보낸 후 서버로부터의 마지막 응답을 기다립니다.
        ws.close()
    thread.start_new_thread(run, ())

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://nginx/ws/",
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
