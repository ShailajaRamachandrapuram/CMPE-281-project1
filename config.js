const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "database-1.cgfusp3cz2br.us-west-1.rds.amazonaws.com",
    user: "admin",
    password: "Shailaja_6610",
    database: "cmpe281",
	  port: 3306,
  },
  listPerPage: 10,
};
module.exports = config;
