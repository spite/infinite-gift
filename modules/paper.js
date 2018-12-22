console.log('PAPER WORKER');

let papers;

onmessage = function(e) {
  console.log('Message received from main script', e.data);
  if (e.data.fn) {
    const f = eval(JSON.parse(e.data.fn));
    f.render();
    debugger;
  }
  /*var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);*/
}