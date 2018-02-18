module.exports = function (){
  let environments = ['development', 'test'];
  let env = 'development'

  if(process.env.NODE_ENV && environments.includes(process.env.NODE_ENV)){
    env = process.env.NODE_ENV;
  }
  console.log('Env:', env);
  process.env.NODE_ENV = env;
  return env;
}

