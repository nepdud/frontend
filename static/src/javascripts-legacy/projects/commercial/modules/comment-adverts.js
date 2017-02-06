define([
    'common/utils/$',
    'common/utils/config',
    'common/utils/mediator',
    'common/utils/fastdom-promise',
    'common/modules/commercial/dfp/add-slot',
    'common/modules/commercial/commercial-features',
    'common/modules/commercial/dfp/create-slot'
], function (
    $,
    config,
    mediator,
    fastdom,
    addSlot,
    commercialFeatures,
    createSlot
) {
    return function () {
        var $adSlotContainer = $('.js-discussion__ad-slot');

        if (!commercialFeatures.commentAdverts || !$adSlotContainer.length) {
            return false;
        }

        mediator.once('modules:comments:renderComments:rendered', function () {
            var $commentMainColumn = $('.js-comments .content__main-column');

            fastdom.read(function () {
                return $commentMainColumn.dim().height;
            })
            .then(function(mainColHeight) {
                //if comments container is lower than 280px
                if (mainColHeight < 280) {
                    return false;
                }

                var adSlot = createSlot('container', { classes: 'mpu-banner-ad', name: 'comments' });
                var classNames = 'discussion__ad-wrapper' +
                    (!config.page.isLiveBlog && !config.page.isMinuteArticle ? ' discussion__ad-wrapper-wider' : '')

                fastdom.write(function () {
                    $commentMainColumn.addClass(classNames);
                    $adSlotContainer.append(adSlot);
                    addSlot(adSlot);
                });
            });
        });
    };
});
