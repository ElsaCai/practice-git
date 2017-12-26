(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":1}],3:[function(require,module,exports){
module.exports={
  "EXAMPLE_HELLO_WORLD": "Hello world",
  "EXAMPLE_SITE_CONFIGURE": "Configure me!",
  "CONFIG_FIST_NAME": "First Name",
  "CONFIG_LAST_NAME": "LAST Name",
  "CONFIG_FAVOR_COLOR": "Favorite Color",
  "CONFIG_FAVOR_CITY": "Favorite City",
  "CONFIG_VERIFIED": "Verified",
  "CONFIG_RESPONSE": "RESPONSE",
  "CONFIG_APPLY": "APPLY CHANGES",
  "CONFIG_RESET": "RESET",
  "CONFIG_CANCEL": "CANCEL"
}

},{}],4:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div data-role=\"fieldcontain\" class=\"config\">CONFIGURATION<hr><form name=\"myform\"><div data-role=\"fieldcontain\"><label for=\"first_name\">{{'CONFIG_FIST_NAME' | translate}}</label><input id=\"fname\" name=\"fname\" type=\"text\" ng-model=\"FirstName\" required><p ng-show=\"showMsgs &amp;&amp; myform.fname.$error.required\">This field is required</p></div><div data-role=\"fieldcontain\"><label for=\"last_name\">{{'CONFIG_LAST_NAME' | translate}}</label><input id=\"lname\" name=\"lname\" type=\"text\" ng-model=\"LastName\" required><p ng-show=\"showMsgs &amp;&amp; myform.lname.$error.required\">This field is required</p></div><div data-role=\"fieldcontain\"><label for=\"favorite_color\">{{'CONFIG_FAVOR_COLOR' | translate}}</label><span ng-repeat=\"color in colors\"><input type=\"checkbox\" ng-model=\"colorsObj[color.name]\" value=\"{{color.name}}\">{{color.name}}</span></div><div data-role=\"fieldcontain\"><label style=\"float:left;height:40px;\">{{'CONFIG_FAVOR_CITY' | translate}}</label><span ng-repeat=\"city in citys\" class=\"block\"><input type=\"radio\" name=\"city\" ng-model=\"citysObj[city.name]\" value=\"{{city.name}}\">{{city.name}}</span></div><div data-role=\"fieldcontain\"><label for=\"verified\">{{'CONFIG_VERIFIED' | translate}}</label><label class=\"switch\"><input type=\"checkbox\" ng-model=\"formElem.checkbox\" ng-change=\"toggleChange(formElem.checkbox)\" ng-checked=\"formElem.checkbox == 1\"><div class=\"slider round\"><span class=\"on\">On</span><span class=\"off\">Off</span></div></label></div><hr><div data-role=\"fieldcontain\"><input type=\"button\" value=\"{{'CONFIG_APPLY' | translate}}\" ng-click=\"getAllSelected()\" class=\"btn btn-apply btn-lg\"><input type=\"button\" value=\"RESET\" ng-click=\"reset()\" class=\"btn btn-reset btn-lg\"><input type=\"button\" value=\"CANCEL\" ng-click=\"reset()\" class=\"btn btn-cancel btn-lg\"></div></form></div><div data-role=\"fieldcontain\" class=\"response\">{{'CONFIG_RESPONSE' | translate}}<hr><div data-role=\"fieldcontain\"><label for=\"r_first_name\">{{'CONFIG_FIST_NAME' | translate}}</label><span id=\"f_name_txt\">{{ fname }}</span></div><div data-role=\"fieldcontain\"><label for=\"r_first_name\">{{'CONFIG_LAST_NAME' | translate}}</label><span id=\"l_name_txt\">{{ lname}}</span></div><div data-role=\"fieldcontain\"><label for=\"r_favorite_color\">{{'CONFIG_FAVOR_COLOR' | translate}}</label><span id=\"favorite_color_txt\">{{ r_colorNameArray }}</span></div><div data-role=\"fieldcontain\"><label for=\"r_favorite_city\">{{'CONFIG_FAVOR_CITY' | translate}}</label><span id=\"favorite_city_txt\">{{ r_cityNameArray }}</span></div><div data-role=\"fieldcontain\"><label for=\"r_verified\">{{'CONFIG_VERIFIED' | translate}}</label><span id=\"verified_txt\">{{r_switch}}</span></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],5:[function(require,module,exports){
'use strict';
var app = angular.module('example');
app.directive('setConfig', [
  function () {
    return {
      controller: 'ConfigurationController',
      controllerAs: 'configurationCtrl',
      template: require('../configuration/configuration.jade')()
    };
  }
]);


},{"../configuration/configuration.jade":4}],6:[function(require,module,exports){
'use strict';

function HelloWorldController () {

}

HelloWorldController.$inject = [];

angular.module('example').controller('HelloWorldController', HelloWorldController);

},{}],7:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"unifiTest unifiTest--centered\"><div class=\"unifiTest__headline\">{{'EXAMPLE_HELLO_WORLD' | translate}}</div><a ui-sref=\"configure\" translate=\"EXAMPLE_SITE_CONFIGURE\" class=\"unifiTest__link\"></a></div>");;return buf.join("");
};
},{"jade/runtime":2}],8:[function(require,module,exports){
'use strict';

angular.module('example').directive('unifiHelloWorld', [
  function () {
    return {
      controller: 'HelloWorldController',
      controllerAs: 'helloWorldCtrl',
      template: require('./helloWorld.jade')()
    };
  }
]);


},{"./helloWorld.jade":7}],9:[function(require,module,exports){
'use strict';

angular.module('example').config([
  '$urlRouterProvider',
  '$locationProvider',
  function (
    $urlRouterProvider,
    $locationProvider
  ) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    }
]);

},{}],10:[function(require,module,exports){
'use strict';

angular.module('example').config([
  '$stateProvider',
  function (
    $stateProvider
  ) {
    $stateProvider
      .state('home', {
        controller: 'HomeController',
        controllerAs: 'homeCtrl',
        url: '/',
        template: require('../../views/home.jade')()
      })
      .state('configure', {
            controller: 'ConfigurationController',
            controllerAs: 'configurationCtrl',
            url: '/configure',
            template: require('../components/configuration/configuration.jade')()
        });
  }
]);

},{"../../views/home.jade":16,"../components/configuration/configuration.jade":4}],11:[function(require,module,exports){
'use strict';

angular.module('example').config([
  '$translateProvider',
  '$translatePartialLoaderProvider',
  function (
    $translateProvider,
    $translatePartialLoaderProvider
  ) {
    $translateProvider
      .addInterpolation('$translateMessageFormatInterpolation')
      .useSanitizeValueStrategy('escapeParameters')
      .uniformLanguageTag('bcp47')
      .useLoader('$translatePartialLoader', {
        urlTemplate: 'locales/{lang}/{part}.json'
      })
      .preferredLanguage('en');

    $translatePartialLoaderProvider.setPart('en', 'example', require('../../locales/en/example.json'));
  }
]);

},{"../../locales/en/example.json":3}],12:[function(require,module,exports){
'use strict';

var app = angular.module('example');
app.controller('ConfigurationController', ['$scope', function($scope) {
  //toogle switch
  var s_result = 'Yes';
  $scope.formElem = {
    checkbox: true
  };

  $scope.toggleChange = function () {
    if($scope.formElem.checkbox) {
      s_result = 'Yes';
    } else {
      s_result = 'No';
    }
  };

  //Name.
  $scope.FirstName = '';
	$scope.LastName = '';
  //Color
  $scope.colors = [{name:'Red'}, {name:'Orange'}, {name:'Yellow'}, {name:'Green'}, {name:'Blue'}, {name:'Purple'}, {name:'Black'}];
  $scope.colorsObj = {};

  $scope.citys = [{name:'Chicago'}, {name:'Seattle'}, {name:'Los Angeles'}];
  $scope.citysObj = {};

  $scope.getAllSelected = function() {
    //Clear
    $scope.colorNameArray = [];
    $scope.cityNameArray = [];
    angular.forEach($scope.citysObj, function(key, value){
      if(key) {
        $scope.cityNameArray.push(value);
      }
    });
    $scope.r_cityNameArray = $scope.cityNameArray.toString();

    angular.forEach($scope.colorsObj, function(key, value){
      if(key) {
        $scope.colorNameArray.push(value);
      }
    });
    $scope.r_colorNameArray = $scope.colorNameArray.toString();

    if($scope.FirstName) {
      $scope.fname = $scope.FirstName;
    } else {
      $scope.showMsgs = true;
      return;
    }
		if($scope.LastName) {
			$scope.lname = $scope.LastName;
		}else {
      $scope.showMsgs = true;
      return;
    }
    $scope.r_switch = s_result;
  };

  $scope.reset = function(){
    $scope.FirstName = '';
    $scope.LastName = '';
    $scope.colorsObj = {};
    $scope.citysObj = {};
  };
}]);

},{}],13:[function(require,module,exports){
'use strict';

function HomeController (
  translateResolver
) {
  translateResolver.resolve('example');
}

HomeController.$inject = [
  'translateResolver'
];

angular.module('example').controller('HomeController', HomeController);

},{}],14:[function(require,module,exports){
'use strict';

// ## Module definition
// Define our apps module and an array of other required modules.

angular.module('example', [
  'ngSanitize',
  'pascalprecht.translate',
  'ui.router'
]);

// ## Source Requires

require('./components/configuration/configuration.js');require('./components/helloWorld/HelloWorldController.js');require('./components/helloWorld/helloWorld.js');require('./config/routes.js');require('./config/states.js');require('./config/translate.js');require('./controllers/ConfigurationController.js');require('./controllers/HomeController.js');require('./services/translateResolver.js');

},{"./components/configuration/configuration.js":5,"./components/helloWorld/HelloWorldController.js":6,"./components/helloWorld/helloWorld.js":8,"./config/routes.js":9,"./config/states.js":10,"./config/translate.js":11,"./controllers/ConfigurationController.js":12,"./controllers/HomeController.js":13,"./services/translateResolver.js":15}],15:[function(require,module,exports){
'use strict';

angular.module('example').service('translateResolver', [
  '$translate',
  '$translatePartialLoader',
  function (
    $translate,
    $translatePartialLoader
  ) {
    this.resolve = function () {
      Array.from(arguments)
        .forEach(function (part) {
          $translatePartialLoader.addPart(part);
        });

      return $translate.refresh();
    };
  }
]);

},{}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<unifi-hello-world></unifi-hello-world>");;return buf.join("");
};
},{"jade/runtime":2}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsInNyYy9sb2NhbGVzL2VuL2V4YW1wbGUuanNvbiIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uLmphZGUiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvaGVsbG9Xb3JsZC9IZWxsb1dvcmxkQ29udHJvbGxlci5qcyIsInNyYy9zY3JpcHRzL2NvbXBvbmVudHMvaGVsbG9Xb3JsZC9oZWxsb1dvcmxkLmphZGUiLCJzcmMvc2NyaXB0cy9jb21wb25lbnRzL2hlbGxvV29ybGQvaGVsbG9Xb3JsZC5qcyIsInNyYy9zY3JpcHRzL2NvbmZpZy9yb3V0ZXMuanMiLCJzcmMvc2NyaXB0cy9jb25maWcvc3RhdGVzLmpzIiwic3JjL3NjcmlwdHMvY29uZmlnL3RyYW5zbGF0ZS5qcyIsInNyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL0NvbmZpZ3VyYXRpb25Db250cm9sbGVyLmpzIiwic3JjL3NjcmlwdHMvY29udHJvbGxlcnMvSG9tZUNvbnRyb2xsZXIuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIiwic3JjL3NjcmlwdHMvc2VydmljZXMvdHJhbnNsYXRlUmVzb2x2ZXIuanMiLCJzcmMvdmlld3MvaG9tZS5qYWRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5qYWRlID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBqYWRlX2VuY29kZV9odG1sX3J1bGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG52YXIgamFkZV9tYXRjaF9odG1sID0gL1smPD5cIl0vZztcblxuZnVuY3Rpb24gamFkZV9lbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBqYWRlX2VuY29kZV9odG1sX3J1bGVzW2NdIHx8IGM7XG59XG5cbmV4cG9ydHMuZXNjYXBlID0gamFkZV9lc2NhcGU7XG5mdW5jdGlvbiBqYWRlX2VzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKS5yZXBsYWNlKGphZGVfbWF0Y2hfaHRtbCwgamFkZV9lbmNvZGVfY2hhcik7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuZXhwb3J0cy5EZWJ1Z0l0ZW0gPSBmdW5jdGlvbiBEZWJ1Z0l0ZW0obGluZW5vLCBmaWxlbmFtZSkge1xuICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xufVxuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIkVYQU1QTEVfSEVMTE9fV09STERcIjogXCJIZWxsbyB3b3JsZFwiLFxuICBcIkVYQU1QTEVfU0lURV9DT05GSUdVUkVcIjogXCJDb25maWd1cmUgbWUhXCIsXG4gIFwiQ09ORklHX0ZJU1RfTkFNRVwiOiBcIkZpcnN0IE5hbWVcIixcbiAgXCJDT05GSUdfTEFTVF9OQU1FXCI6IFwiTEFTVCBOYW1lXCIsXG4gIFwiQ09ORklHX0ZBVk9SX0NPTE9SXCI6IFwiRmF2b3JpdGUgQ29sb3JcIixcbiAgXCJDT05GSUdfRkFWT1JfQ0lUWVwiOiBcIkZhdm9yaXRlIENpdHlcIixcbiAgXCJDT05GSUdfVkVSSUZJRURcIjogXCJWZXJpZmllZFwiLFxuICBcIkNPTkZJR19SRVNQT05TRVwiOiBcIlJFU1BPTlNFXCIsXG4gIFwiQ09ORklHX0FQUExZXCI6IFwiQVBQTFkgQ0hBTkdFU1wiLFxuICBcIkNPTkZJR19SRVNFVFwiOiBcIlJFU0VUXCIsXG4gIFwiQ09ORklHX0NBTkNFTFwiOiBcIkNBTkNFTFwiXG59XG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGRhdGEtcm9sZT1cXFwiZmllbGRjb250YWluXFxcIiBjbGFzcz1cXFwiY29uZmlnXFxcIj5DT05GSUdVUkFUSU9OPGhyPjxmb3JtIG5hbWU9XFxcIm15Zm9ybVxcXCI+PGRpdiBkYXRhLXJvbGU9XFxcImZpZWxkY29udGFpblxcXCI+PGxhYmVsIGZvcj1cXFwiZmlyc3RfbmFtZVxcXCI+e3snQ09ORklHX0ZJU1RfTkFNRScgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PGlucHV0IGlkPVxcXCJmbmFtZVxcXCIgbmFtZT1cXFwiZm5hbWVcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJGaXJzdE5hbWVcXFwiIHJlcXVpcmVkPjxwIG5nLXNob3c9XFxcInNob3dNc2dzICZhbXA7JmFtcDsgbXlmb3JtLmZuYW1lLiRlcnJvci5yZXF1aXJlZFxcXCI+VGhpcyBmaWVsZCBpcyByZXF1aXJlZDwvcD48L2Rpdj48ZGl2IGRhdGEtcm9sZT1cXFwiZmllbGRjb250YWluXFxcIj48bGFiZWwgZm9yPVxcXCJsYXN0X25hbWVcXFwiPnt7J0NPTkZJR19MQVNUX05BTUUnIHwgdHJhbnNsYXRlfX08L2xhYmVsPjxpbnB1dCBpZD1cXFwibG5hbWVcXFwiIG5hbWU9XFxcImxuYW1lXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiTGFzdE5hbWVcXFwiIHJlcXVpcmVkPjxwIG5nLXNob3c9XFxcInNob3dNc2dzICZhbXA7JmFtcDsgbXlmb3JtLmxuYW1lLiRlcnJvci5yZXF1aXJlZFxcXCI+VGhpcyBmaWVsZCBpcyByZXF1aXJlZDwvcD48L2Rpdj48ZGl2IGRhdGEtcm9sZT1cXFwiZmllbGRjb250YWluXFxcIj48bGFiZWwgZm9yPVxcXCJmYXZvcml0ZV9jb2xvclxcXCI+e3snQ09ORklHX0ZBVk9SX0NPTE9SJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48c3BhbiBuZy1yZXBlYXQ9XFxcImNvbG9yIGluIGNvbG9yc1xcXCI+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuZy1tb2RlbD1cXFwiY29sb3JzT2JqW2NvbG9yLm5hbWVdXFxcIiB2YWx1ZT1cXFwie3tjb2xvci5uYW1lfX1cXFwiPnt7Y29sb3IubmFtZX19PC9zcGFuPjwvZGl2PjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiPjxsYWJlbCBzdHlsZT1cXFwiZmxvYXQ6bGVmdDtoZWlnaHQ6NDBweDtcXFwiPnt7J0NPTkZJR19GQVZPUl9DSVRZJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48c3BhbiBuZy1yZXBlYXQ9XFxcImNpdHkgaW4gY2l0eXNcXFwiIGNsYXNzPVxcXCJibG9ja1xcXCI+PGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJjaXR5XFxcIiBuZy1tb2RlbD1cXFwiY2l0eXNPYmpbY2l0eS5uYW1lXVxcXCIgdmFsdWU9XFxcInt7Y2l0eS5uYW1lfX1cXFwiPnt7Y2l0eS5uYW1lfX08L3NwYW4+PC9kaXY+PGRpdiBkYXRhLXJvbGU9XFxcImZpZWxkY29udGFpblxcXCI+PGxhYmVsIGZvcj1cXFwidmVyaWZpZWRcXFwiPnt7J0NPTkZJR19WRVJJRklFRCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PGxhYmVsIGNsYXNzPVxcXCJzd2l0Y2hcXFwiPjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmctbW9kZWw9XFxcImZvcm1FbGVtLmNoZWNrYm94XFxcIiBuZy1jaGFuZ2U9XFxcInRvZ2dsZUNoYW5nZShmb3JtRWxlbS5jaGVja2JveClcXFwiIG5nLWNoZWNrZWQ9XFxcImZvcm1FbGVtLmNoZWNrYm94ID09IDFcXFwiPjxkaXYgY2xhc3M9XFxcInNsaWRlciByb3VuZFxcXCI+PHNwYW4gY2xhc3M9XFxcIm9uXFxcIj5Pbjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwib2ZmXFxcIj5PZmY8L3NwYW4+PC9kaXY+PC9sYWJlbD48L2Rpdj48aHI+PGRpdiBkYXRhLXJvbGU9XFxcImZpZWxkY29udGFpblxcXCI+PGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcInt7J0NPTkZJR19BUFBMWScgfCB0cmFuc2xhdGV9fVxcXCIgbmctY2xpY2s9XFxcImdldEFsbFNlbGVjdGVkKClcXFwiIGNsYXNzPVxcXCJidG4gYnRuLWFwcGx5IGJ0bi1sZ1xcXCI+PGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlJFU0VUXFxcIiBuZy1jbGljaz1cXFwicmVzZXQoKVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcmVzZXQgYnRuLWxnXFxcIj48aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiQ0FOQ0VMXFxcIiBuZy1jbGljaz1cXFwicmVzZXQoKVxcXCIgY2xhc3M9XFxcImJ0biBidG4tY2FuY2VsIGJ0bi1sZ1xcXCI+PC9kaXY+PC9mb3JtPjwvZGl2PjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiIGNsYXNzPVxcXCJyZXNwb25zZVxcXCI+e3snQ09ORklHX1JFU1BPTlNFJyB8IHRyYW5zbGF0ZX19PGhyPjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiPjxsYWJlbCBmb3I9XFxcInJfZmlyc3RfbmFtZVxcXCI+e3snQ09ORklHX0ZJU1RfTkFNRScgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PHNwYW4gaWQ9XFxcImZfbmFtZV90eHRcXFwiPnt7IGZuYW1lIH19PC9zcGFuPjwvZGl2PjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiPjxsYWJlbCBmb3I9XFxcInJfZmlyc3RfbmFtZVxcXCI+e3snQ09ORklHX0xBU1RfTkFNRScgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PHNwYW4gaWQ9XFxcImxfbmFtZV90eHRcXFwiPnt7IGxuYW1lfX08L3NwYW4+PC9kaXY+PGRpdiBkYXRhLXJvbGU9XFxcImZpZWxkY29udGFpblxcXCI+PGxhYmVsIGZvcj1cXFwicl9mYXZvcml0ZV9jb2xvclxcXCI+e3snQ09ORklHX0ZBVk9SX0NPTE9SJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48c3BhbiBpZD1cXFwiZmF2b3JpdGVfY29sb3JfdHh0XFxcIj57eyByX2NvbG9yTmFtZUFycmF5IH19PC9zcGFuPjwvZGl2PjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiPjxsYWJlbCBmb3I9XFxcInJfZmF2b3JpdGVfY2l0eVxcXCI+e3snQ09ORklHX0ZBVk9SX0NJVFknIHwgdHJhbnNsYXRlfX08L2xhYmVsPjxzcGFuIGlkPVxcXCJmYXZvcml0ZV9jaXR5X3R4dFxcXCI+e3sgcl9jaXR5TmFtZUFycmF5IH19PC9zcGFuPjwvZGl2PjxkaXYgZGF0YS1yb2xlPVxcXCJmaWVsZGNvbnRhaW5cXFwiPjxsYWJlbCBmb3I9XFxcInJfdmVyaWZpZWRcXFwiPnt7J0NPTkZJR19WRVJJRklFRCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PHNwYW4gaWQ9XFxcInZlcmlmaWVkX3R4dFxcXCI+e3tyX3N3aXRjaH19PC9zcGFuPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2V4YW1wbGUnKTtcbmFwcC5kaXJlY3RpdmUoJ3NldENvbmZpZycsIFtcbiAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250cm9sbGVyOiAnQ29uZmlndXJhdGlvbkNvbnRyb2xsZXInLFxuICAgICAgY29udHJvbGxlckFzOiAnY29uZmlndXJhdGlvbkN0cmwnLFxuICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi5qYWRlJykoKVxuICAgIH07XG4gIH1cbl0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEhlbGxvV29ybGRDb250cm9sbGVyICgpIHtcblxufVxuXG5IZWxsb1dvcmxkQ29udHJvbGxlci4kaW5qZWN0ID0gW107XG5cbmFuZ3VsYXIubW9kdWxlKCdleGFtcGxlJykuY29udHJvbGxlcignSGVsbG9Xb3JsZENvbnRyb2xsZXInLCBIZWxsb1dvcmxkQ29udHJvbGxlcik7XG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJ1bmlmaVRlc3QgdW5pZmlUZXN0LS1jZW50ZXJlZFxcXCI+PGRpdiBjbGFzcz1cXFwidW5pZmlUZXN0X19oZWFkbGluZVxcXCI+e3snRVhBTVBMRV9IRUxMT19XT1JMRCcgfCB0cmFuc2xhdGV9fTwvZGl2PjxhIHVpLXNyZWY9XFxcImNvbmZpZ3VyZVxcXCIgdHJhbnNsYXRlPVxcXCJFWEFNUExFX1NJVEVfQ09ORklHVVJFXFxcIiBjbGFzcz1cXFwidW5pZmlUZXN0X19saW5rXFxcIj48L2E+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2V4YW1wbGUnKS5kaXJlY3RpdmUoJ3VuaWZpSGVsbG9Xb3JsZCcsIFtcbiAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250cm9sbGVyOiAnSGVsbG9Xb3JsZENvbnRyb2xsZXInLFxuICAgICAgY29udHJvbGxlckFzOiAnaGVsbG9Xb3JsZEN0cmwnLFxuICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vaGVsbG9Xb3JsZC5qYWRlJykoKVxuICAgIH07XG4gIH1cbl0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdleGFtcGxlJykuY29uZmlnKFtcbiAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICckbG9jYXRpb25Qcm92aWRlcicsXG4gIGZ1bmN0aW9uIChcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIsXG4gICAgJGxvY2F0aW9uUHJvdmlkZXJcbiAgKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAub3RoZXJ3aXNlKCcvJyk7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIH1cbl0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnZXhhbXBsZScpLmNvbmZpZyhbXG4gICckc3RhdGVQcm92aWRlcicsXG4gIGZ1bmN0aW9uIChcbiAgICAkc3RhdGVQcm92aWRlclxuICApIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdob21lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdob21lQ3RybCcsXG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vLi4vdmlld3MvaG9tZS5qYWRlJykoKVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnY29uZmlndXJlJywge1xuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpZ3VyYXRpb25Db250cm9sbGVyJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbmZpZ3VyYXRpb25DdHJsJyxcbiAgICAgICAgICAgIHVybDogJy9jb25maWd1cmUnLFxuICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uLmphZGUnKSgpXG4gICAgICAgIH0pO1xuICB9XG5dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2V4YW1wbGUnKS5jb25maWcoW1xuICAnJHRyYW5zbGF0ZVByb3ZpZGVyJyxcbiAgJyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXInLFxuICBmdW5jdGlvbiAoXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLFxuICAgICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXJcbiAgKSB7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAuYWRkSW50ZXJwb2xhdGlvbignJHRyYW5zbGF0ZU1lc3NhZ2VGb3JtYXRJbnRlcnBvbGF0aW9uJylcbiAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZVBhcmFtZXRlcnMnKVxuICAgICAgLnVuaWZvcm1MYW5ndWFnZVRhZygnYmNwNDcnKVxuICAgICAgLnVzZUxvYWRlcignJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLCB7XG4gICAgICAgIHVybFRlbXBsYXRlOiAnbG9jYWxlcy97bGFuZ30ve3BhcnR9Lmpzb24nXG4gICAgICB9KVxuICAgICAgLnByZWZlcnJlZExhbmd1YWdlKCdlbicpO1xuXG4gICAgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXJQcm92aWRlci5zZXRQYXJ0KCdlbicsICdleGFtcGxlJywgcmVxdWlyZSgnLi4vLi4vbG9jYWxlcy9lbi9leGFtcGxlLmpzb24nKSk7XG4gIH1cbl0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2V4YW1wbGUnKTtcbmFwcC5jb250cm9sbGVyKCdDb25maWd1cmF0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gIC8vdG9vZ2xlIHN3aXRjaFxuICB2YXIgc19yZXN1bHQgPSAnWWVzJztcbiAgJHNjb3BlLmZvcm1FbGVtID0ge1xuICAgIGNoZWNrYm94OiB0cnVlXG4gIH07XG5cbiAgJHNjb3BlLnRvZ2dsZUNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZigkc2NvcGUuZm9ybUVsZW0uY2hlY2tib3gpIHtcbiAgICAgIHNfcmVzdWx0ID0gJ1llcyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNfcmVzdWx0ID0gJ05vJztcbiAgICB9XG4gIH07XG5cbiAgLy9OYW1lLlxuICAkc2NvcGUuRmlyc3ROYW1lID0gJyc7XG5cdCRzY29wZS5MYXN0TmFtZSA9ICcnO1xuICAvL0NvbG9yXG4gICRzY29wZS5jb2xvcnMgPSBbe25hbWU6J1JlZCd9LCB7bmFtZTonT3JhbmdlJ30sIHtuYW1lOidZZWxsb3cnfSwge25hbWU6J0dyZWVuJ30sIHtuYW1lOidCbHVlJ30sIHtuYW1lOidQdXJwbGUnfSwge25hbWU6J0JsYWNrJ31dO1xuICAkc2NvcGUuY29sb3JzT2JqID0ge307XG5cbiAgJHNjb3BlLmNpdHlzID0gW3tuYW1lOidDaGljYWdvJ30sIHtuYW1lOidTZWF0dGxlJ30sIHtuYW1lOidMb3MgQW5nZWxlcyd9XTtcbiAgJHNjb3BlLmNpdHlzT2JqID0ge307XG5cbiAgJHNjb3BlLmdldEFsbFNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgLy9DbGVhclxuICAgICRzY29wZS5jb2xvck5hbWVBcnJheSA9IFtdO1xuICAgICRzY29wZS5jaXR5TmFtZUFycmF5ID0gW107XG4gICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5jaXR5c09iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICBpZihrZXkpIHtcbiAgICAgICAgJHNjb3BlLmNpdHlOYW1lQXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJHNjb3BlLnJfY2l0eU5hbWVBcnJheSA9ICRzY29wZS5jaXR5TmFtZUFycmF5LnRvU3RyaW5nKCk7XG5cbiAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvbG9yc09iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICBpZihrZXkpIHtcbiAgICAgICAgJHNjb3BlLmNvbG9yTmFtZUFycmF5LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICRzY29wZS5yX2NvbG9yTmFtZUFycmF5ID0gJHNjb3BlLmNvbG9yTmFtZUFycmF5LnRvU3RyaW5nKCk7XG5cbiAgICBpZigkc2NvcGUuRmlyc3ROYW1lKSB7XG4gICAgICAkc2NvcGUuZm5hbWUgPSAkc2NvcGUuRmlyc3ROYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuc2hvd01zZ3MgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblx0XHRpZigkc2NvcGUuTGFzdE5hbWUpIHtcblx0XHRcdCRzY29wZS5sbmFtZSA9ICRzY29wZS5MYXN0TmFtZTtcblx0XHR9ZWxzZSB7XG4gICAgICAkc2NvcGUuc2hvd01zZ3MgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAkc2NvcGUucl9zd2l0Y2ggPSBzX3Jlc3VsdDtcbiAgfTtcblxuICAkc2NvcGUucmVzZXQgPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS5GaXJzdE5hbWUgPSAnJztcbiAgICAkc2NvcGUuTGFzdE5hbWUgPSAnJztcbiAgICAkc2NvcGUuY29sb3JzT2JqID0ge307XG4gICAgJHNjb3BlLmNpdHlzT2JqID0ge307XG4gIH07XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIEhvbWVDb250cm9sbGVyIChcbiAgdHJhbnNsYXRlUmVzb2x2ZXJcbikge1xuICB0cmFuc2xhdGVSZXNvbHZlci5yZXNvbHZlKCdleGFtcGxlJyk7XG59XG5cbkhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbXG4gICd0cmFuc2xhdGVSZXNvbHZlcidcbl07XG5cbmFuZ3VsYXIubW9kdWxlKCdleGFtcGxlJykuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vICMjIE1vZHVsZSBkZWZpbml0aW9uXG4vLyBEZWZpbmUgb3VyIGFwcHMgbW9kdWxlIGFuZCBhbiBhcnJheSBvZiBvdGhlciByZXF1aXJlZCBtb2R1bGVzLlxuXG5hbmd1bGFyLm1vZHVsZSgnZXhhbXBsZScsIFtcbiAgJ25nU2FuaXRpemUnLFxuICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXG4gICd1aS5yb3V0ZXInXG5dKTtcblxuLy8gIyMgU291cmNlIFJlcXVpcmVzXG5cbnJlcXVpcmUoJy4vY29tcG9uZW50cy9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24uanMnKTtyZXF1aXJlKCcuL2NvbXBvbmVudHMvaGVsbG9Xb3JsZC9IZWxsb1dvcmxkQ29udHJvbGxlci5qcycpO3JlcXVpcmUoJy4vY29tcG9uZW50cy9oZWxsb1dvcmxkL2hlbGxvV29ybGQuanMnKTtyZXF1aXJlKCcuL2NvbmZpZy9yb3V0ZXMuanMnKTtyZXF1aXJlKCcuL2NvbmZpZy9zdGF0ZXMuanMnKTtyZXF1aXJlKCcuL2NvbmZpZy90cmFuc2xhdGUuanMnKTtyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NvbmZpZ3VyYXRpb25Db250cm9sbGVyLmpzJyk7cmVxdWlyZSgnLi9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcycpO3JlcXVpcmUoJy4vc2VydmljZXMvdHJhbnNsYXRlUmVzb2x2ZXIuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2V4YW1wbGUnKS5zZXJ2aWNlKCd0cmFuc2xhdGVSZXNvbHZlcicsIFtcbiAgJyR0cmFuc2xhdGUnLFxuICAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLFxuICBmdW5jdGlvbiAoXG4gICAgJHRyYW5zbGF0ZSxcbiAgICAkdHJhbnNsYXRlUGFydGlhbExvYWRlclxuICApIHtcbiAgICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBBcnJheS5mcm9tKGFyZ3VtZW50cylcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgICAkdHJhbnNsYXRlUGFydGlhbExvYWRlci5hZGRQYXJ0KHBhcnQpO1xuICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuICR0cmFuc2xhdGUucmVmcmVzaCgpO1xuICAgIH07XG4gIH1cbl0pO1xuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPHVuaWZpLWhlbGxvLXdvcmxkPjwvdW5pZmktaGVsbG8td29ybGQ+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyJdfQ==
