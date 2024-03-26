     The `Worker` class represents an independent JavaScript execution thread.
     Most Node.js APIs are available inside of it.
          Notable differences inside a Worker environment are:
          * The `process.stdin`, `process.stdout`, and `process.stderr` streams may be redirected by the parent thread.
     * The `require('node:worker_threads').isMainThread` property is set to `false`.
     * The `require('node:worker_threads').parentPort` message port is available.
     * `process.exit()` does not stop the whole program, just the single thread,
     and `process.abort()` is not available.
     * `process.chdir()` and `process` methods that set group or user ids
     are not available.
     * `process.env` is a copy of the parent thread's environment variables,
     unless otherwise specified. Changes to one copy are not visible in other
     threads, and are not visible to native add-ons (unless `worker.SHARE_ENV` is passed as the `env` option to the `Worker` constructor). On Windows, unlike the main thread, a py of the
     environment variables operates in a case-sensitive manner.
     * `process.title` cannot be modified.
     * Signals are not delivered through `process.on('...')`.
     * Execution may stop at any point as a result of `worker.terminate()` being invoked.
     * IPC channels from parent processes are not accessible.
     * The `trace_events` module is not supported.
     * Native add-ons can only be loaded from multiple threads if they fulfill `certain conditions`.
          Creating `Worker` instances inside of other `Worker`s is possible.
          Like [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and the `node:cluster module`, two-way communication
     can be achieved through inter-thread message passing. Internally, a `Worker` has
     a built-in pair of `MessagePort` s that are already associated with each
     other when the `Worker` is created. While the `MessagePort` object on the parent
     side is not directly exposed, its functionalities are exposed through `worker.postMessage()` and the `worker.on('message')` event
     on the `Worker` object for the parent thread.
          To create custom messaging channels (which is encouraged over using the default
     global channel because it facilitates separation of concerns), users can create
     a `MessageChannel` object on either thread and pass one of the`MessagePort`s on that `MessageChannel` to the other thread through a
     pre-existing channel, such as the global one.
          See `port.postMessage()` for more information on how messages are passed,
     and what kind of JavaScript values can be successfully transported through
     the thread barrier.
          ```js
     const assert = require('node:assert');
     const {
       Worker, MessageChannel, MessagePort, isMainThread, parentPort,
     } = require('node:worker_threads');
     if (isMainThread) {
       const worker = new Worker(__filename);
       const subChannel = new MessageChannel();
       worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
       subChannel.port2.on('message', (value) => {
         console.log('received:', value);
       });
     } else {
       parentPort.once('message', (value) => {
         assert(value.hereIsYourPort instanceof MessagePort);
         value.hereIsYourPort.postMessage('the worker is sending this');
         value.hereIsYourPort.close();
       });
     }
     ```
     @since v10.5.0

