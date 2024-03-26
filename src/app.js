const assert = require("node:assert");
const {
  Worker,
  MessageChannel,
  MessagePort,
  isMainThread,
  parentPort,
} = require("node:worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename); // (1)
  const subChannel = new MessageChannel(); // (2)

  worker.postMessage({ hello: subChannel.port1 }, [subChannel.port1]); // (3)
  subChannel.port2.on("message", (value) => console.log("받은내용임: ", value)); //(4)
} else {
  parentPort.once("message", (value) => {
    //(5)
    assert(value.hello instanceof MessagePort); //(6)
    value.hello.postMessage("나 worker thread인데~ 나 메시지 보낸다~"); // (7)
    value.hello.close(); // (8)
  });
}

/**
 * (1) Worker
 * * - 새로운 워커 스레드를 생성함
 * - 첫번째 인자로 메일 스크립트의 파일경로을 받음 (예제에서는 __filename으로 넣음)
 *
 * (2) MessageChannel
 * - MessageChannel은 별도 메소드가 있진 않고, 호출하면 `port1`, `port2` 속성을 지닌 객체가 반환됨
 * - 얘네로 port2에서 port1으로 메시지 보내고, port1에서 메시지 출력 가능
 * ```js
 * const { MessageChannel } = require("node:worker_threads");
 *
 * const { port1, port2 } = new MessageChannel();
 * port1.on("message", (message) => console.log("받았드앙: ", message)); // 받았드앙:  { hi: "보냈드앙" }
 * port2.postMessage({ hi: "보냈드앙" });
 * ```
 *
 * (3) port1 양도
 * - MessageChannel 인스턴스 객체를 통해(subChannel) port1은 worker한테 양도
 * - 이를 위해 두번째 인자인 transferList에 port1을 보내줌
 *
 * (4) 지니고 있는 port2로 메시지를 받고 콘솔 출력하기 위한 용도
 *
 * (5) 부모 스레드 한테 받은 메시지 수신하기 위한 용도
 *
 * (6) assert모듈로 받은 메시지(의 hello 프로퍼티가) MessagePort 인스턴스인지 확인
 *
 * (7) 받은 value.hello (즉 (3)에서 양도받은 subChannel.port1) 를 통해서 다시 메시지 보냄 ()
 *
 * (8) 메시지 전송 후 포트 닫기: 이제 이 포트를 통한 통신이 필요없으니 자원 정리 용도
 *
 * 실행 시 `받은내용임:  나 worker thread인데~ 나 메시지 보낸다~`이 출력됨.
 * 그럼에도 헷갈리면 코드 다시 까보기(worker_threads.d.ts)
 */
