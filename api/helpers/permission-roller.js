module.exports = {
  friendlyName: "Permission roller",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    var permission_rollers = await PermissionRoller.find();

    if (permission_rollers.length > 0) {
      for (let permission_roller of permission_rollers) {
        var permission_id_exist = await PermissionSettings.findOne({
          id: permission_roller.perm_id,
        });
        if (permission_id_exist) {
          continue;
        }

        var permission_exist = await PermissionSettings.findOne({
          perm_desc: permission_roller.perm_desc,
          perm_category: permission_roller.perm_category,
        });

        if (permission_exist) {
          await PermissionRoller.destroy({ id: permission_roller.id });
          continue;
        }

        var new_permission = await PermissionSettings.create({
          perm_desc: permission_roller.perm_desc,
          perm_category: permission_roller.perm_category,
          default_perm: permission_roller.default_perm,
          id: permission_roller.perm_id,
        }).fetch();

        await PermissionRoller.destroy({ id: permission_roller.id });

        var perm_groups = [];
        if (
          permission_roller.perm_groups != null &&
          permission_roller.perm_groups != ""
        ) {
          var perm_groups = permission_roller.perm_groups.split(",");
        } else {
          var perm_groups = [];
        }

        // cerate permissions
        if (perm_groups.length > 0 && permission_roller.default_perm == 1) {
          for (let perm_group of perm_groups) {
            var permission_g_exist = await PermissionGroup.findOne({
              perm_id: new_permission.id,
              role_id: perm_group,
            });

            if (permission_g_exist) {
              continue;
            }

            await PermissionGroup.create({
              perm_id: new_permission.id,
              role_id: perm_group,
            });

            var users = await User.find({ userlevel: perm_group });

            for (let user of users) {
              // check permission exist
              var perm_exist = await UserPermission.findOne({
                userid: user.id,
                perm_id: new_permission.id,
              });
              if (!perm_exist) {
                await UserPermission.create({
                  userid: user.id,
                  perm_id: new_permission.id,
                  perm_level: 1,
                });
              }
            }
          }
        }
      }
    }

    return exits.success({ status: true });
  },
};
