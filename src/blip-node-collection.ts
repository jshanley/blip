function BlipNodeCollection(nodes) {
  this.nodes = nodes || [];
}

BlipNodeCollection.prototype = {

  count: function() {
    return this.nodes.length;
  },

  each: function(f) {
    for (let i = 0; i < this.nodes.length; i++) {
      f.call(this, this.nodes[i], i, this.nodes);
    }
  },

  contains: function(node) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] === node) return true;
    }
    return false;
  },

  add: function(node) {
    if (this.nodes.indexOf(node) === -1) this.nodes.push(node);
  },

  remove: function(node) {
    let index = this.nodes.indexOf(node);
    if (index !== -1) this.nodes.splice(index, 1);
  },

  removeAll: function() {
    this.nodes = [];
  }

};

export default BlipNodeCollection;
