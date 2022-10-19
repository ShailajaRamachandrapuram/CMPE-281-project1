const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "database-1.rds.amazonaws.com",
    user: "admin",
    password: "xxxxx",
    database: "cmpe281",
	  port: 3306,
  },
  listPerPage: 10,
};
module.exports = config;
