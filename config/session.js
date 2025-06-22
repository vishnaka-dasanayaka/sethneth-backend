const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const storeInstance = new MySQLStore({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "sethneth",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});

module.exports.session = {
  secret: "9ccc81f5b962dad8b2baa00512c63fc3",
  store: storeInstance,
  cookie: {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
};
