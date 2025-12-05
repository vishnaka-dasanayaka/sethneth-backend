module.exports = {
  friendlyName: "Get User Permission Categories",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var permission_categories = await sails.sendNativeQuery(
        "SELECT DISTINCT perm_category FROM permission_settings"
      );

      permission_categories = permission_categories.rows;

      return exits.success({
        status: true,
        permission_categories: permission_categories,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-user-permission-categories",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
