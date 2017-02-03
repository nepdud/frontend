define([
    'commercial/modules/dfp/dfp-env',
    'commercial/modules/dfp/load-advert',
    'commercial/modules/dfp/enable-lazy-load',
    'commercial/modules/dfp/performance-logging'
], function (dfpEnv, loadAdvert, enableLazyLoad, performanceLogging) {
    return displayLazyAds;

    function displayLazyAds() {
        window.googletag.pubads().collapseEmptyDivs();
        window.googletag.enableServices();
        instantLoad();
        enableLazyLoad();
    }

    function advertsToInstantlyLoad(advert) {
        return  advert.id === 'dfp-ad--merchandising-high' ||
                advert.id === 'dfp-ad--im';
    }

    function instantLoad() {
        var instantLoadAdverts = dfpEnv.advertsToLoad.filter(function(advert) {
            if (advertsToInstantlyLoad(advert)) {
                performanceLogging.updateAdvertMetric(advert, 'loadingMethod', 'instant');
                performanceLogging.updateAdvertMetric(advert, 'lazyWaitComplete', 0);
                return true;
            } else {
                performanceLogging.updateAdvertMetric(advert, 'loadingMethod', 'lazy-load');
                return false;
            }
        });

        dfpEnv.advertsToLoad = dfpEnv.advertsToLoad.filter(function (advert) {
            return !advertsToInstantlyLoad(advert);
        });

        instantLoadAdverts.forEach(loadAdvert);
    }
});
