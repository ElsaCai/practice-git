module.exports = {
  options: {
    logConcurrentOutput: true,
    limit: 8
  },
  development: [
    'browserify:watchify_source_example',
    'browserify:watchify_components_example',
    'connect:example',
    'watch'
  ]
};
