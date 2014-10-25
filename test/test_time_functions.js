describe('the time module', function() {
	it('should exist', function() {
		expect(typeof blip.time).toEqual('object');
	});
});

describe('when using the time functions', function() {

	describe('the seconds function', function() {
		it('should exist', function() {
			expect(typeof blip.time.seconds).toEqual('function');
		});
		it('should give back its input unchanged', function() {
			expect(blip.time.seconds(3)).toEqual(3);
			expect(blip.time.seconds(2.5)).toEqual(2.5);
		});
	});
	describe('the ms function', function() {
		it('should exist', function() {
			expect(typeof blip.time.ms).toEqual('function');
		});
		it('should convert from milliseconds to seconds', function() {
			expect(blip.time.ms(25)).toEqual(0.025);
		});
	});
	describe('the samp function', function() {
		it('should exist', function() {
			expect(typeof blip.time.samp).toEqual('function')
		});
		it('should convert from samples to seconds', function() {
			expect(blip.time.samp(200)).toEqual(200 / blip.getContext().sampleRate);
		});
	});
})