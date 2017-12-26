// # Components
// Our own Angular components. After being compiled, `components.js`
// is minified and concatenated with `main.js` for the production build.

require('angular');
require('angular-sanitize');
require('angular-translate');
require('angular-translate-loader-partial');
require('angular-ui-router');

// MessageFormat needs to be a global so that angular-translate-interpolation-messageformat can use it.
window.MessageFormat = require('messageformat').MessageFormat;
require('angular-translate-interpolation-messageformat');
