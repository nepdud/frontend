define([
    'qwery',
    'Promise',
    'common/utils/fastdom-promise',
    'common/modules/commercial/commercial-features',
    'common/utils/config'
], function (
    qwery,
    Promise,
    fastdom,
    commercialFeatures,
    config
) {
    var adSlotSelector = '.js-ad-slot';

    return {
        init: init
    };

    function init(moduleName, force) {

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
        return isDisabledCommercialFeature(adSlot) || isVisuallyHidden(adSlot);
    }

    function isVisuallyHidden(adSlot) {
        return window.getComputedStyle(adSlot).display === 'none';
    }

    function isDisabledCommercialFeature(adSlot) {
        return !commercialFeatures.topBannerAd && adSlot.getAttribute('data-name') === 'top-above-nav';
    }

});
