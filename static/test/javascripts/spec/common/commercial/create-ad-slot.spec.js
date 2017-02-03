define([
    'bonzo',
    'helpers/injector',
    'text!fixtures/commercial/ad-slots/im.html',
    'text!fixtures/commercial/ad-slots/inline1.html',
    'text!fixtures/commercial/ad-slots/right.html'
], function (
    bonzo,
    Injector,
    imHtml,
    inline1Html,
    rightHtml
) {
    describe('Create Ad Slot', function () {

        var injector = new Injector(),
            createSlot;

        beforeEach(function (done) {
            injector.require(['common/modules/commercial/dfp/create-slot'], function ($1) {
                createSlot = $1;
                done();
            });
        });

        it('should exist', function () {
            expect(createSlot).toBeDefined();
        });

        [
            {
                type: 'right',
                html: rightHtml,
                options: { classes: "mpu-banner-ad" }
            },
            {
                type: 'im',
                html: imHtml
            },
            {
                type: 'inline',
                html: inline1Html,
                options: { name: 'inline1' },
            }
        ].forEach(function (expectation) {
            it('should create "' + expectation.type + '" ad slot', function () {
                var adSlot = createSlot(expectation.type, expectation.options);

                expect(adSlot.outerHTML).toBe(expectation.html.replace(/\n/g, '').replace(/\s+/g, ' '));
            });
        });
    });
});
