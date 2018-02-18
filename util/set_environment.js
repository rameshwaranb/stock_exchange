module.exports = function () {

  const environments = [
    'development',
    'test'
  ];
  let env = 'development';

  if (process.env.NODE_ENV && environments.includes(process.env.NODE_ENV)) {
    env = process.env.NODE_ENV;
  }
  process.env.NODE_ENV = env;

  return env;
};

