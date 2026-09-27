/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

// module.exports.datastores = {

//   default: {

//     adapter: "sails-mysql",
//     // url: "mysql://admin:0svYx5CCPzafD2e0F77v@rds-1.c7w2qm68g4by.ap-southeast-1.rds.amazonaws.com:3306/sethneth",
//     // SethNeth AWS
//     url: "mysql://admin:t7sS5poFZ3WDFEb4DGJC@sethneth.cz2ayigmmq24.ap-southeast-1.rds.amazonaws.com:3306/sethneth",
//     // url: "mysql://root:root@127.0.0.1:3306/sethneth",
//   },
// };

module.exports.datastores = {
  default: {
    adapter: "sails-mysql",

    host: "sethneth.cz2ayigmmq24.ap-southeast-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "t7sS5poFZ3WDFEb4DGJC",
    database: "sethneth",

    // host: "localhost",
    // port: 3306,
    // user: "root",
    // password: "root",
    // database: "sethneth",

    ssl: {
      rejectUnauthorized: false,
    },
  },
};
