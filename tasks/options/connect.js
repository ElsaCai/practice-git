module.exports = {
  example: {
    options: {
      hostname: 'localhost',
      port: 6060,
      keepalive: true,
      livereload: true,
      base: '<%= pkg.config.buildDir %>'
    }
  }
};
