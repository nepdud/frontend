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
        merchandising: {
            label: false,
            refresh: false,
            name: 'merchandising-high',
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.fluid]
            }
        },
        inline: {
            sizeMappings: {
                mobile: [adSizes.outOfPage, adSizes.empty, adSizes.mpu, adSizes.fluid],
                desktop: [adSizes.outOfPage, adSizes.empty, adSizes.mpu, adSizes.video, adSizes.video2, adSizes.fluid]
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

    function sortSizes(s1, s2) {
        if ( s1 === 'fluid' ) {
            return -1;
        } else if (s2 === 'fluid') {
            return 1;
        } else if (s1.width !== s2.width) {
            return s1.width - s2.width;
        } else {
            return s1.height - s2.height;
        }
    }

    return function (type, options) {
        var attributes = [],
            name, classes, definition;

        options = options || {};
        definition = adSlotDefinitions[type];

        classes = (options.classes || '').split(' ');
        name = options.name || definition.name || type;

        Object.keys(definition.sizeMappings).forEach(function (size) {
            var sizes = options.sizes && options.sizes[size] ?
                definition.sizeMappings[size].concat(options.sizes[size]) :
                definition.sizeMappings[size];
            attributes.push([size, sizes.sort(sortSizes).join('|')]);
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
