const { isMainThread, Worker, workerData } = require("worker_threads");

if (isMainThread) {
  const workerData = "worker thread를 생성하며 같이 전달하고 싶은 데이터"; // (1-1)
  const worker = new Worker(__filename, { workerData });
} else {
  console.log(workerData); // (1-2)
}

/**
 * (1-1) workerData는 Worker 인스턴스를 생성하며 같이 전달하고 싶은 데이터를 담을 수 있는 옵션
 * (1-2) require('worker_threads').workerData를 통해 접근 가능
 */
