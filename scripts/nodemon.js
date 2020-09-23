const nodemon = require('nodemon');

nodemon({
  ignore: ['node_modules'],
  script: 'src/index',
  ext: 'js json',
  verbose: true,
  watch: ['src/**/*.js'],
  env: process.env,
});

nodemon
  .on('restart', (files) => {
    console.log(`Nodemon restarting because ${files.join(',')} changed.`);
  })
  .on('crash', () => {
    console.error('Nodemon crashed. Waiting for changes to restart.');
  });
