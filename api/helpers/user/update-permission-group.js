module.exports = {
  friendlyName: "Update permission group",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
    },
    state: {
      required: true,
      type: "ref",
    },
    userlevel: {
      required: true,
      type: "number",
    },
    logged_user: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    if (inputs.state) {
      var permission_exist = await PermissionGroup.findOne({
        perm_id: inputs.id,
        role_id: inputs.userlevel,
      });
      if (!permission_exist) {
        await PermissionGroup.create({
          perm_id: inputs.id,
          role_id: inputs.userlevel,
        });

        var permission_settings = await PermissionSettings.findOne({
          id: inputs.id,
        });

        await SystemLog.create({
          userid: inputs.logged_user,
          info:
            "User Level Permission: " +
            permission_settings.perm_desc +
            " has been enabled for user level: " +
            inputs.userlevel,
        });
      }
    } else {
      await PermissionGroup.destroy({
        role_id: inputs.userlevel,
        perm_id: inputs.id,
      });

      var permission_settings = await PermissionSettings.findOne({
        id: inputs.id,
      });

      await SystemLog.create({
        userid: inputs.logged_user,
        info:
          "User Level Permission: " +
          permission_settings.perm_desc +
          " has been disabled for user level: " +
          inputs.userlevel,
      });
    }

    var users = await User.find({ userlevel: inputs.userlevel });

    for (let user of users) {
      // check permission exist
      var perm_exist = await UserPermission.findOne({
        userid: user.id,
        perm_id: inputs.id,
      });
      if (inputs.state) {
        if (!perm_exist) {
          await UserPermission.create({
            userid: user.id,
            perm_id: inputs.id,
            perm_level: 1,
          });

          var permission_settings = await PermissionSettings.findOne({
            id: inputs.id,
          });

          await SystemLog.create({
            userid: inputs.logged_user,
            info:
              "User Permission: " +
              permission_settings.perm_desc +
              " has been enabled for user: " +
              user.id,
          });
        }
      } else {
        if (perm_exist) {
          await UserPermission.destroy({
            userid: user.id,
            perm_id: inputs.id,
          });

          var permission_settings = await PermissionSettings.findOne({
            id: inputs.id,
          });

          await SystemLog.create({
            userid: inputs.logged_user,
            info:
              "User Permission: " +
              permission_settings.perm_desc +
              " has been disabled for user: " +
              user.id,
          });
        }
      }
    }

    // All done.
    return exits.success({
      status: true,
    });
  },
};
