blip.chain = function(nodes) {

  nodes = nodes || [];

  wire();

  function chain() {}

  function wire() {
    for (var i = 0; i < nodes.length-1; i++) {
      nodes[i].connect(nodes[i+1]);
    }
  }

  chain.node = function(blipnode) {
    nodes.push(blipnode);
    wire();
    return chain;
  };
  chain.start = function() {
    var a = nodes.slice(0,1);
    return a.length ? a[0] : null;
  };
  chain.end = function() {
    var a = nodes.slice(-1);
    console.log(a);
    return a.length ? a[0] : null;
  };
  chain.from = function(blipnode) {
    blipnode.connect(chain.start());
    return chain;
  };
  chain.to = function(blipnode) {
    chain.end().connect(blipnode);
    return chain;
  };
  chain.wire = function() {
    wire();
    return chain;
  }

  return chain;
}
