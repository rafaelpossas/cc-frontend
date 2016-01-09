(function (angular) {
    'use strict';
    angular.module('amalieiev.international').provider('$international', [function () {
        var translations = {},
            translationsCache = {},
            parts = [],
            settings = {
                baseLocale: null,
                preferredLocale: 'en',
                urlTemplate: '/i18n/{locale}/{part}.json'
            };

        function getUrl(locale, part) {
            return settings.urlTemplate.replace('{locale}', locale).replace('{part}', part);
        }

        function getSync(url) {
            var xhr;
            if (translationsCache[url]) {
                return translationsCache[url];
            }
            xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            translationsCache[url] = JSON.parse(xhr.responseText);
            return translationsCache[url];
        }

        function loadParts(locale) {
            angular.forEach(parts, function (part) {
                angular.extend(translations, getSync(getUrl(locale, part)));
            });
        }

        return {
            config: function (config) {
                if (config.baseLocale) {
                    settings.baseLocale = config.baseLocale;
                }
                if (config.preferredLocale) {
                    settings.preferredLocale = config.preferredLocale;
                }
                if (config.urlTemplate) {
                    settings.urlTemplate = config.urlTemplate;
                }
            },
            addPart: function (part) {
                parts.push(part);
            },
            $get: function () {
                if (settings.baseLocale) {
                    loadParts(settings.baseLocale);
                }
                if (settings.baseLocale !== settings.preferredLocale) {
                    loadParts(settings.preferredLocale);
                }
                return {
                    use: loadParts,
                    locale: translations
                };
            }
        };
    }]);
}(angular));
