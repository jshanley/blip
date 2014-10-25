describe('when creating a single connection between two nodes', function() {

	var g1 = blip.node('gain');
	var g2 = blip.node('gain');
	g1.connect(g2);

	describe('the first node', function() {

		it('should have one output', function() {
			expect(g1.outputs.nodes.length).toEqual(1);
		});
		it('should have zero inputs', function() {
			expect(g1.inputs.nodes.length).toEqual(0);
		});
		it('should contain the second node in its outputs', function() {
			expect(g1.outputs.contains(g2)).toBe(true);
		});
	});

	describe('the second node', function() {

		it('should have one input', function() {
			expect(g2.inputs.nodes.length).toEqual(1);
		});
		it('should have zero outputs', function() {
			expect(g2.outputs.nodes.length).toEqual(0);
		});
		it('should contain the first node in its inputs', function() {
			expect(g2.inputs.contains(g1)).toBe(true);
		});
	});

});

describe('disconnecting two connected nodes', function() {
	var g1 = blip.node('gain');
	var g2 = blip.node('gain');
	g1.connect(g2);
	g1.disconnect();

	it('should remove outputs from the first node', function() {
		expect(g1.outputs.nodes.length).toEqual(0);
	});
	it('should remove the first node from the second node\'s inputs', function() {
		expect(g2.inputs.nodes.length).toEqual(0);
	});
});