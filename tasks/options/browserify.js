module.exports = {
  options: {
    browserifyOptions: {
      debug: true
    },
    transform: [
      ['require-globify', {global: true}],
      ['jadeify', {global: true, doctype: 'html'}]
    ]
  },
  source_example: {
    dest: '<%= pkg.config.buildDir %>js/main.js',
    src: 'src/scripts/main.js',
    options: {
      debug: true,
      sourceMapRoot: 'main'
    }
  },
  watchify_source_example: {
    dest: '<%= pkg.config.buildDir %>js/main.js',
    src: 'src/scripts/main.js',
    options: {
      watch: true,
      keepAlive: true
    }
  },
  components_example: {
    dest: "<%= pkg.config.buildDir %>js/components.js",
    src: [
      'src/scripts/components.js'
    ]
  },
  watchify_components_example: {
    dest: '<%= pkg.config.buildDir %>js/components.js',
    src: [
      'src/scripts/components.js'
    ],
    options: {
      watch: true,
      keepAlive: true
    }
  }
};
