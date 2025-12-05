module.exports = {
  friendlyName: "Get Permission By Userlevel",

  description: "",

  inputs: {
    user_level: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var permissions_SQL =
        "SELECT t1.* FROM permission_settings t1 ORDER BY t1.perm_category ASC, t1.perm_desc ASC";

      var permissions = await sails.sendNativeQuery(permissions_SQL);
      permissions = permissions.rows;

      var category_list = [];
      var all_permissions = [];

      for (let permission of permissions) {
        var user_permission = await PermissionGroup.findOne({
          role_id: inputs.user_level,
          perm_id: permission.id,
        });
        if (user_permission) {
          permission.status = true;
        } else {
          permission.status = false;
        }

        var item = all_permissions.findIndex(
          (i) => i.perm_category == permission.perm_category
        );

        if (item === -1) {
          var obj = {
            perm_category: permission.perm_category,
            permissions: [permission],
          };
          all_permissions.push(obj);
        } else {
          all_permissions[item].permissions.push(permission);
        }

        if (!category_list.includes(permission.perm_category)) {
          category_list.push(permission.perm_category);
        }
      }

      return exits.success({
        status: true,
        permissions: all_permissions,
        categories: category_list,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-permission-by-userlevel",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
