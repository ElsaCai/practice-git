module.exports = {
  main_example: {
    files: {
      '<%= pkg.config.buildDir %>css/app.css': 'src/styles/main.scss'
    },
    options: {
      style: 'compressed',
      sourcemap: 'none',
      compass: true
    }
  }
};
