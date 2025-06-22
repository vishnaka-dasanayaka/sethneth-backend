/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "users",

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    firstname: { type: "string", required: true },
    lastname: { type: "string", allowNull: true },
    username: { type: "string", unique: true, required: true },
    password: { type: "string", required: true },
    userlevel: { model: "UserRole" },
    email: { type: "string", unique: true, allowNull: true },
    mobile: { type: "string", allowNull: true },
    designation: { type: "string", allowNull: true },
    disabled: { type: "number" },
    allowed_ips: { type: "string", allowNull: true },
    two_factor_secret: { type: "string", allowNull: true },
    two_factor_secret_string: { type: "string", allowNull: true },
    two_factor_status: { type: "number", defaultsTo: 0 },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    perm_list: {
      collection: "UserPermission",
      via: "userid",
    },
  },
};
