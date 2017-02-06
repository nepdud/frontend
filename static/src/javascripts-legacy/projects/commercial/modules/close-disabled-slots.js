define([
    'qwery',
    'Promise',
    'common/utils/fastdom-promise',
    'common/modules/commercial/commercial-features'
], function (
    qwery,
    Promise,
    fastdom,
    commercialFeatures
) {
    var adSlotSelector = '.js-ad-slot';

    return {
        init: init
    };

    function init(force) {

        // Get all ad slots
        var modulePromises = qwery(adSlotSelector)
            // remove the ones which should not be there
            .filter(function (adSlot) {
                // filter out (and remove) hidden ads
                return force || shouldDisableAdSlot(adSlot);
            })
            .map(function (adSlot){
                return fastdom.write(function () {
                    adSlot.parentNode.removeChild(adSlot);
                });
            });

        return Promise.all(modulePromises);
    }

    function shouldDisableAdSlot(adSlot) {
        return isVisuallyHidden(adSlot);
    }

    function isVisuallyHidden(adSlot) {
        return window.getComputedStyle(adSlot).display === 'none';
    }
});
