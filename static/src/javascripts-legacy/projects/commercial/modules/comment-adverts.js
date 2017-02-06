define([
    'Promise',
    'common/utils/$',
    'common/utils/config',
    'common/utils/detect',
    'common/utils/mediator',
    'common/utils/fastdom-idle',
    'common/modules/identity/api',
    'common/modules/experiments/ab',
    'common/modules/commercial/dfp/add-slot',
    'common/modules/commercial/commercial-features',
    'common/modules/commercial/dfp/create-slot',
    'lodash/objects/defaults'
], function (
    Promise,
    $,
    config,
    detect,
    mediator,
    idleFastdom,
    identityApi,
    ab,
    addSlot,
    commercialFeatures,
    createSlot,
    defaults
) {
    return function (options) {
        var opts = defaults(
                options || {},
                {
                    adSlotContainerSelector: '.js-discussion__ad-slot',
                    commentMainColumn: '.content__main-column'
                }
            ),
            $adSlotContainer,
            $commentMainColumn;

        $adSlotContainer = $(opts.adSlotContainerSelector);
        $commentMainColumn = $(opts.commentMainColumn, '.js-comments');

        if (!commercialFeatures.commentAdverts || !$adSlotContainer.length) {
            return false;
        }

        mediator.once('modules:comments:renderComments:rendered', function () {
            idleFastdom.read(function () {
                //if comments container is lower than 280px
                if ($commentMainColumn.dim().height < 280) {
                    return false;
                }

                idleFastdom.write(function () {
                    var adSlot;

                    $commentMainColumn.addClass('discussion__ad-wrapper');

                    if (!config.page.isLiveBlog && !config.page.isMinuteArticle) {
                        $commentMainColumn.addClass('discussion__ad-wrapper-wider');
                    }

                    adSlot = createSlot('container', { classes: 'mpu-banner-ad', name: 'comments' });
                    $adSlotContainer.append(adSlot);
                    addSlot(adSlot);
                });
            });
        });
    };
});
