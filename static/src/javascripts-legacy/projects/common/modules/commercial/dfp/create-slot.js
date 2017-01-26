define([
    'common/utils/config',
    'common/modules/commercial/ad-sizes'
], function (
    config,
    adSizes
) {
    var adSlotDefinitions = {
        right: {
            sizeMappings: {
                mobile: [
                    adSizes.outOfPage,
                    adSizes.empty,
                    adSizes.mpu,
                    adSizes.halfPage,
                    adSizes.fluid
                ].concat(config.page.edition === 'US' ? adSizes.portrait : [])
            }
        },
        'right-small': {
            name: 'right',
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.mpu, adSizes.fluid]
            }
        },
        im: {
            label: false,
            refresh: false,
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.inlineMerchandising, adSizes.fluid]
            }
        },
        'high-merch': {
            label: false,
            refresh: false,
            name: 'merchandising-high',
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.merchandisingHigh, adSizes.fluid]
            }
        },
        'high-merch-paid': {
            label: false,
            refresh: false,
            name: 'merchandising-high',
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.merchandisingHighAdFeature, adSizes.fluid]
            }
        },
        inline: {
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.mpu, adSizes.fluid],
                desktop: [adSizes.outOfPage, adSizes.empty, adSizes.mpu, adSizes.video, adSizes.fluid]
            }
        },
        'top-above-nav': {
            sizeMappings: {
                mobile: [
                    adSizes.outOfPage,
                    adSizes.empty,
                    adSizes.mpu,
                    adSizes.fluid250,
                    adSizes.fabric,
                    adSizes.fluid
                ]
            }
        }
    };

    function createAdSlotElement(name, attrs, classes) {
        var adSlot = document.createElement('div');
        adSlot.id = 'dfp-ad--' + name;
        adSlot.className = 'js-ad-slot ad-slot ' + classes.map(function (type) {
            return 'ad-slot--' + type;
        }).join(' ');
        adSlot.setAttribute('data-link-name', 'ad slot ' + name);
        adSlot.setAttribute('data-name', name);
        attrs.forEach(function (attr) { adSlot.setAttribute('data-' + attr[0], attr[1]); });
        return adSlot;
    }

    return function (name, slotTypes, options) {
        var slotName = name,
            attributes = [],
            definition,
            classes = Array.isArray(slotTypes) ? slotTypes : [slotTypes];

        options = options || {};
        definition = adSlotDefinitions[slotName] || adSlotDefinitions.inline;
        name = options.name || definition.name || name;

        Object.keys(definition.sizeMappings).forEach(function (size) {
            attributes.push([size, definition.sizeMappings[size].join('|')]);
        });

        if (definition.label === false) {
            attributes.push(['label', 'false']);
        }

        if (definition.refresh === false) {
            attributes.push(['refresh', 'false']);
        }

        classes.push(name);

        return createAdSlotElement(name, attributes, classes);
    };

});
