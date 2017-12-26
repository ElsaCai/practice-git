module.exports = {
  views_example: {
    expand: true,
    cwd: 'src/views',
    src: ['**/*.jade'],
    ext: '.html',
    dest: 'tmp/views',
    options: {
      doctype: "html"
    }
  },
  index_example: {
    files: {
      '<%= pkg.config.buildDir %>index.html': 'src/index.jade'
    },
    options: {
      data: {
        liveReloadPort: '<%= package.liveReloadPort %>',
        development: true
      }
    }
  }
};
