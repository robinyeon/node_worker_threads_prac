const {
  isMainThread,
  workerData,
  parentPort,
  Worker,
} = require("worker_threads");

if (isMainThread) {
  const threads = new Array();

  threads.push(new Worker(__filename, { workerData: 111111 }));
  threads.push(new Worker(__filename, { workerData: 222222 }));

  for (const worker of threads) {
    worker.on(
      "message",
      (value) => console.log(`받은 메시지는 이거지롱: ${value}`) // 워커 스레드에서의 실행순서는 항상 일정하지 않기 때문에 메시지 순서가 다를 수 있다. (스레드는 제어 못하니까)
    );
  }
} else {
  const data = workerData;
  parentPort.postMessage(`데이터는 ${data}이지롱`);
}
