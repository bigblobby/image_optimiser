const optimiseService = require('./optimise');

describe('Optimise service', () => {
    describe('check defaults', () => {
        const emptyRequest = {}
        const validatedEmptyRequest = optimiseService.validate(emptyRequest);

        it('should have a default width option', () => {
            expect(validatedEmptyRequest.width).not.toBeNull();
            expect(validatedEmptyRequest.width).toEqual(expect.any(Number));
        })
        it('should have a default height option', () => {
            expect(validatedEmptyRequest.width).not.toBeNull();
            expect(validatedEmptyRequest.width).toEqual(expect.any(Number));
        })
        it('should have a default quality option', () => {
            expect(validatedEmptyRequest.quality).not.toBeNaN();
        })
        it('should have a default fit option', () => {
            expect(validatedEmptyRequest.fit).toBeOneOf(['cover', 'contain', 'fill', 'inside', 'outside'])
        })
        it('should have a default position option', () => {
            expect(validatedEmptyRequest.position).toBeOneOf(['center', 'top', 'top right', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top'])
        })
        it('should have the default of \'jpeg\' set for the output option', () => {
            expect(validatedEmptyRequest.output).toEqual('jpeg');
        })
    })
})