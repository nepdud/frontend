define([
    'bean',
    'fastdom',
    'Promise',
    'lodash/functions/debounce',
    'common/utils/config',
    'common/utils/cookies',
    'common/utils/storage',
    'common/utils/mediator',
    'common/utils/fastdom-promise',
    'common/utils/private-browsing',
    'text!common/views/experiments/tailor-survey.html',
    'common/utils/fetch-json',
    'lodash/collections/forEach'
], function (
    bean,
    fastdom,
    Promise,
    debounce,
    config,
    cookies,
    storage,
    mediator,
    fastdomPromise,
    privateBrowsing,
    quickSurvey,
    fetchJson,
    forEach
) {
    return function () {
        this.id = 'TailorSurvey';
        this.start = '2017-01-25';
        this.expiry = '2017-02-31';
        this.author = 'Manlio';
        this.description = 'Testing Tailor surveys';
        this.audience = 0.01;
        this.audienceOffset = 0;
        this.successMeasure = 'We can show a survey on Frontend to regular users only (as decided by Tailor)';
        this.audienceCriteria = 'All users';
        this.dataLinkNames = 'Tailor survey';
        this.idealOutcome = '';

        this.canRun = function () {
            return !(config.page.isAdvertisementFeature) &&
                config.page.contentType === 'Article'
        };

        function callTailor(bwid) {
            if (!bwid) {
                // console.log('No cookie found :(');
            }
            else {
                var endpoint = 'https://tailor.guardianapis.com/suggestions?browserId=' + bwid;
                var request = fetchJson(endpoint, {
                    type: 'json',
                    method: 'get'
                });
                return request.then(function (body) {
                    return {
                        tailorResponse: body
                    }
                });
            }
        }

        function renderQuickSurvey() {
            var bwid = cookies.get('bwid');

            return callTailor(bwid).then(function (response) {
                var isRegular = response.tailorResponse.userDataForClient.regular;
                return isRegular;
            }).then(function(isRegular) {

                var hasSeenTheSurveyAlready = cookies.get('GU_TAILOR_SURVEY_1') || false;
                if (isRegular && !hasSeenTheSurveyAlready) {
                    cookies.add('GU_TAILOR_SURVEY_1', 1, 100); // do not show this survey to the user for the next 100 days

                    return fastdomPromise.write(function () {
                        var article = document.getElementsByClassName('content__article-body')[0];
                        var insertionPoint = article.getElementsByTagName('p')[1];
                        var surveyDiv = document.createElement('div');
                        surveyDiv.innerHTML = quickSurvey;
                        article.insertBefore(surveyDiv, insertionPoint);
                    });
                }
                else {
                    // console.log("User isn't regular, or has seen the survey before")
                }
            });
        }

        function disableRadioButtons(buttonClassName) {
            var radioButtons = document.getElementsByClassName(buttonClassName);
            for (var i = 0; i < radioButtons.length; i++) {
                radioButtons[i].disabled=true;
            }
        }

        function surveyFadeOut() {
            var surveyContent = document.getElementsByClassName('impressions-survey__content');
            fastdom.write(function () {
                surveyContent[0].classList.add('js-impressions-survey__fadeout');
            });
        }

        function thankyouFadeIn() {
            var surveyThanks = document.getElementsByClassName('impressions-survey__thanks');
            fastdom.write(function () {
                surveyThanks[0].classList.add('js-impressions-survey__fadein');
            });
        }

        function handleSurveyResponse() {
            var surveyQuestions = document.getElementsByClassName('fi-survey__button');

            forEach(surveyQuestions, function(question) {
                bean.on(question, 'click', function (event) {
                    
                    var answer = event.target.attributes.getNamedItem("data-link-name").value;
                    recordOphanAbEvent(answer);

                    mediator.emit('clicked');
                    fastdom.write(function () {
                        disableRadioButtons('fi-survey__button');
                        surveyFadeOut();
                        thankyouFadeIn();
                    });
                });
                }
            );
        }

        function recordOphanAbEvent(answer) {
            require(['ophan/ng'], function (ophan) {
                ophan.record({
                    component: 'tailor-survey',
                    value: answer
                });
            });
        }

        this.variants = [
            {
                id: 'variant',
                test: function () {
                    Promise.all([renderQuickSurvey(), privateBrowsing]).then(function () {
                        mediator.emit('survey-added');
                        handleSurveyResponse();
                    });
                },
                impression: function(track) {
                    mediator.on('survey-added', track);
                },
                success: function(complete) {
                    mediator.on('clicked', complete);
                }
            },
            {
                id: 'control',
                test: function () {
                    // console.log("Control group - nothing to be done here")
                }
            }
        ];
    };
});