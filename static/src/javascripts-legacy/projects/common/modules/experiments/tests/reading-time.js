define([
    'bean',
    'fastdom',
    'Promise',
    'qwery',
    'common/utils/$',
    'common/utils/storage',
    'common/utils/config',
    'common/utils/template',
    'common/views/svg',
    'common/modules/onward/history',
    'common/utils/ajax',
    'text!common/views/experiments/reading-time.html',
    'inlineSvg!svgs/icon/profile-36.svg',
    'inlineSvg!svgs/icon/arrow-right.svg',
    'inlineSvg!svgs/icon/marque-36.svg' //TODO: remove the unused stuff here
], function (
    bean,
    fastdom,
    Promise,
    qwery,
    $,
    storage,
    config,
    template,
    svg,
    history,
    ajax,
    readingTimeTemplate,
    profileIcon,
    rightArrowIcon,
    guardianLogo
) {

    return function () {

        this.id = 'ReadingTime';
        this.start = '2017-01-25';
        this.expiry = '2017-02-16';
        this.author = 'Leigh-Anne Mathieson';
        this.description = 'Add an extra container on the home front that prompts the user to select how much' +
            'time they have to read.';
        this.audience = 0;
        this.audienceOffset = 0;
        this.successMeasure = 'Clicks/demand';
        this.audienceCriteria = 'All users';
        this.dataLinkNames = '';
        this.idealOutcome = 'People will visit more often';

        var $sectionBelow;
        var $readingTimeSection = null;

        this.canRun = function() {
            $sectionBelow = $('#sport'); //temporary -- just put it somewhere for initial version
            return config.page.contentType === 'Network Front' && $sectionBelow.length;
        };


        this.variants = [
            {
                id: 'simple',
                test: function () {
                    insertTimeSelectionContainer();
                }
            },
            {
                id: 'control',
                test: function () {}
            }
        ];

        function insertTimeSelectionContainer(){
            $readingTimeSection = $.create(template(readingTimeTemplate, {
                profileIcon: svg(profileIcon, ['rounded-icon', 'rfy-profile-icon', 'control__icon-wrapper']),
                rightArrowIcon: svg(rightArrowIcon, ['i-right']),
                guardianLogo: svg(guardianLogo)
            }));

            return fastdom.write(function() {
                registerOptInButtonHandlers($readingTimeSection);
                $readingTimeSection.insertBefore($sectionBelow);
            });
        }

        function registerOptInButtonHandlers(section) {
            bean.on($('.js-feedback-button-5', section)[0], 'click', function () {
                $('.js-feedback', section).html(photos());
            });

            bean.on($('.js-feedback-button-15', section)[0], 'click', function () {
                $('.js-feedback', section).html(mostPopular());
            });

            bean.on($('.js-feedback-button-30', section)[0], 'click', function () {
                $('.js-feedback', section).html(longReads());
            });
        }

        function photos() {
            var photosLink = 'https://www.theguardian.com/inpictures';

            return 'You might enjoy a quick flip through our <a href="'+photosLink+'">photo galleries</a>';
        }

        function mostPopular() {
            var mostReadLink = 'https://www.theguardian.com/most-read';

            return 'You\'ve got time to catch up on our <a href="'+mostReadLink+'">most popular stories</a>';
        }

        function longReads() {
            var longReadsLink = 'https://www.theguardian.com/news/series/the-long-read';

            return 'Check out our latest <a href="' + longReadsLink + '">long reads</a>';
        }

    };
});
