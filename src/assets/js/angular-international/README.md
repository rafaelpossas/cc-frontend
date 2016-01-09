# angular-international - [AngularJS](http://angularjs.org/) module which provides simple way to make you application international.

## Installation
`bower install angular-international`

## Simple usage

### Files structure
```
root
  bower_components
  i18n
    en
      main.json
    ru
      main.json
  index.html
  app.js
```

index.html
```html
<!DOCTYPE html>
<html ng-app="myApp">
<head lang="en">
    <meta charset="UTF-8">
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-international/angular-international.js"></script>
    <script src="app.js"></script>
</head>
<body ng-controller="mainCtrl">

<h2>{{locale.title}}</h2>
<button ng-click="setLang('en')">{{locale.buttons.en}}</button>
<button ng-click="setLang('ru')">{{locale.buttons.ru}}</button>

</body>
</html>
```

app.js
```javascript
angular.module('myApp', [
    'amalieiev.international'
]).config(function ($internationalProvider) {
    $internationalProvider.config({preferredLocale: 'en'});
    $internationalProvider.addPart('main');
}).controller('mainCtrl', function ($scope, $international) {
    $scope.locale = $international.locale;
    $scope.setLang = function (lang) {
        $international.use(lang);
    };
});
```

i18n/en/main.json
```json
{
    "title": "main page",
    "buttons": {
        "ru": "russian",
        "en": "english"
    }
}
```

i18n/ru/main.json
```json
{
    "title": "главная страница",
    "buttons": {
        "ru": "русский",
        "en": "англиский"
    }
}
```
