module.exports = {
    dbConnection: {
        host: 'localhost',
        user: 'bankapp',
        password: 'b4nkapp_pa3ssw0rd',
      },
    con: null,  
    'secret': 'supersecret'
}

// dbConnection: {
//   host: process.env.MYSQL_LOCAL_CONN_URL,
//   user: process.env.MYSQL_DB_USER,
//   password: process.env.MYSQL_DB_PASSWORD,
// },
// 'secret': process.env.JWT_SECRET,