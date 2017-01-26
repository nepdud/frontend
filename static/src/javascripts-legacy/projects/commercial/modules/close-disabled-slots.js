define([
    'bonzo',
    'qwery',
    'Promise',
    'common/utils/$css',
    'common/utils/fastdom-promise',
    'common/modules/commercial/commercial-features',
    'common/utils/config',
    'common/modules/commercial/user-features'
], function (
    bonzo,
    qwery,
    Promise,
    $css,
    fastdom,
    commercialFeatures,
    config,
    userFeatures
) {
    var adSlotSelector = '.js-ad-slot';

    return {
        init: init
    };

    function init(moduleName, force) {

        var modulePromises = [];

        // Get all ad slots
        qwery(adSlotSelector)
            // convert them to bonzo objects
            .map(bonzo)
            // remove the ones which should not be there
            .filter(function ($adSlot) {
                // filter out (and remove) hidden ads
                return force || shouldDisableAdSlot($adSlot);
            })
            .forEach(function ($adSlot){
                modulePromises.push(
                    fastdom.write(function () {
                        $adSlot.remove();
                    })
                );
            });

        return Promise.all(modulePromises);
    }

    function shouldDisableAdSlot($adSlot) {
        return isDisabledCommercialFeature($adSlot) || isVisuallyHidden($adSlot);
    }

    function isVisuallyHidden($adSlot) {
        return $css($adSlot, 'display') === 'none';
    }

    function isDisabledCommercialFeature($adSlot) {
        return !commercialFeatures.topBannerAd && $adSlot.data('name') === 'top-above-nav';
    }

});
