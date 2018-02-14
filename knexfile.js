module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host     : process.env.DB_HOST,
	    port: 3306,
	    user     : process.env.DB_USER,
	    password: process.env.DB_PASS,
	    database : process.env.DB_NAME,
	    charset  : 'utf8'
    }
  },

  test: {
    client: 'mysql',
    connection: {
      host     : process.env.DB_HOST,
      port: 3306,
      user     : process.env.DB_USER,
      password: process.env.DB_PASS,
      database : process.env.TEST_DB_NAME,
      charset  : 'utf8'
    }
  }
}
