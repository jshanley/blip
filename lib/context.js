import 'lib/context-monkeypatch';

let ctx = new AudioContext();

// debug: is this a singleton?
console.log('AudioContext created');

export default ctx;
