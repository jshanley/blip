describe('when creating a chain by adding nodes one at a time,', function() {
	
	var node1, node2, node3, chain;
	
	beforeEach(function() {
		node1 = blip.node('gain');
		node2 = blip.node('convolver');
		node3 = blip.node('delay');
		chain = blip.chain()
			.node(node1)
			.node(node2)
			.node(node3);	
	});

	describe('the first node', function() {
		it('should have zero inputs', function() {
			expect(node1.inputs.count()).toEqual(0);
		});
		it('should have one output', function() {
			expect(node1.outputs.count()).toEqual(1);
		});
		it('should be connected to the second node', function() {
			expect(node1.outputs.contains(node2)).toBe(true);
		});
	});

	describe('the second node', function() {
		it('should have one input', function() {
			expect(node2.inputs.count()).toEqual(1);
		});
		it('should have one output', function() {
			expect(node2.outputs.count()).toEqual(1);
		});
		it('should be connected from the first node', function() {
			expect(node2.inputs.contains(node1)).toBe(true);
		});
		it('should be connected to the third node', function() {
			expect(node2.outputs.contains(node3)).toBe(true);
		});
	});

	describe('the third node', function() {
		it('should have one input', function() {
			expect(node3.inputs.count()).toEqual(1);
		});
		it('should have zero outputs', function() {
			expect(node3.outputs.count()).toEqual(0);
		});
		it('should be connected from the second node', function() {
			expect(node3.inputs.contains(node2)).toBe(true);
		});
	});
});