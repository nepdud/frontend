define([
    'Promise',
    'common/utils/$',
    'common/utils/$css',
    'common/utils/config',
    'common/utils/mediator',
    'common/utils/fastdom-promise',
    'common/modules/commercial/ad-sizes',
    'common/modules/commercial/dfp/create-slot',
    'common/modules/commercial/commercial-features'
], function (
    Promise,
    $,
    $css,
    config,
    mediator,
    fastdom,
    adSizes,
    createSlot,
    commercialFeatures
) {
    var minArticleHeight = 1300;
    var minFootballArticleHeight = 2200;
    var minImmersiveArticleHeight = 600;

    var mainColumnSelector = '.js-content-main-column';
    var rhColumnSelector = '.js-secondary-column';
    var adSlotContainerSelector = '.js-ad-slot-container';
    var componentsContainerSelector = '.js-components-container';

    function init(start, stop) {
        start();

        var $col        = $(rhColumnSelector);
        var $mainCol, $componentsContainer, $adSlotContainer;

        // are article aside ads disabled, or secondary column hidden?
        if (!(commercialFeatures.articleAsideAdverts && $col.length && $css($col, 'display') !== 'none')) {
            stop();
            return Promise.resolve(false);
        }

        $mainCol = $(mainColumnSelector);
        $componentsContainer = $(componentsContainerSelector, $col[0]);
        $adSlotContainer = $(adSlotContainerSelector);

        fastdom.read(function () {
            return $mainCol.dim().height;
        }).then(function (mainColHeight) {
            var adSlot, options = { classes: 'mpu-banner-ad' };
            var largeArticleSizes = {
                mobile: [adSizes.halfPage].concat(config.page.edition === 'US' ? adSizes.portrait : [])
            };

            if (config.page.isImmersive) {
                options.sizes = mainColHeight >= minImmersiveArticleHeight ?
                    largeArticleSizes :
                    null;
            } else {
                options.sizes = (config.page.section !== 'football' && mainColHeight >= minArticleHeight) ||
                                (config.page.section === 'football' && mainColHeight >= minFootballArticleHeight)
                         ? largeArticleSizes : null;
            }

            adSlot = createSlot('right', options);

            return fastdom.write(function () {
                if (config.page.contentType === 'Article' && config.page.sponsorshipType === 'advertisement-features') {
                    $componentsContainer.addClass('u-h');
                }

                $adSlotContainer.append(adSlot);

                return $adSlotContainer;
            });
        })
        .then(function ($adSlotContainer) {
            stop();
            mediator.emit('page:commercial:right', $adSlotContainer);
        });

        return Promise.resolve(true);
    }

    return {
        init: init
    };
});
