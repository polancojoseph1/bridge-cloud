let controller = new AbortController();
let signal = controller.signal;

signal.addEventListener('abort', () => console.log('aborted!'));

controller.abort(new DOMException('Aborted', 'AbortError'));
