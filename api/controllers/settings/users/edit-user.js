module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    id: {
      type: "number",
      required: true,
    },
    firstname: {
      required: true,
      type: "string",
    },
    lastname: {
      required: true,
      type: "string",
    },
    username: {
      required: true,
      type: "string",
    },
    email: {
      required: true,
      type: "string",
    },
    phone: {
      required: true,
      type: "string",
    },
    designation: {
      required: true,
      type: "string",
    },
    userlevel: {
      required: true,
      type: "number",
    },
    uniquekey: {
      required: true,
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      // var uniqueRequest = await UniqueReq.create({
      //   uniquecheck: inputs.uniquekey,
      // }).intercept("E_UNIQUE", () => {
      //   return exits.OtherError({
      //     status: false,
      //     err: "Request already completed. Please Refresh",
      //   });
      // });

      let existing_username = null;

      if (inputs.username !== null && inputs.username !== undefined) {
        existing_username = await User.findOne({
          id: { "!=": inputs.id },
          username: inputs.username,
        });
      }

      if (existing_username) {
        return exits.success({
          status: false,
          err: "A user find with the same username",
        });
      }

      let existing_email = null;

      if (inputs.email !== null && inputs.email !== undefined) {
        existing_email = await User.findOne({
          id: { "!=": inputs.id },
          email: inputs.email,
        });
      }

      if (existing_email) {
        return exits.success({
          status: false,
          err: "A user find with the same email",
        });
      }

      var prev_user = await User.findOne({ id: inputs.id });
      var prev_user_level = prev_user.userlevel;

      await User.updateOne({ id: inputs.id }).set({
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        username: inputs.username,
        email: inputs.email,
        mobile: inputs.phone,
        designation: inputs.designation,
        userlevel: inputs.userlevel,
      });

      if (prev_user_level != inputs.userlevel) {
        await UserPermission.destroy({ userid: inputs.id });

        var default_permission = await PermissionGroup.find({
          role_id: inputs.userlevel,
        });

        for (perm of default_permission) {
          var permission_exist = await UserPermission.findOne({
            userid: inputs.id,
            perm_id: perm.perm_id,
          });
          if (permission_exist) {
            continue;
          }
          await UserPermission.create({
            userid: inputs.id,
            perm_id: perm.perm_id,
            perm_level: perm.default_perm,
          });
        }

        // System Log record
        await SystemLog.create({
          userid: this.req.token.id,
          info:
            "Updated a user of ID :" +
            inputs.id +
            " : Also changed the user level from " +
            prev_user_level +
            " to " +
            inputs.userlevel,
        });
      } else {
        await SystemLog.create({
          userid: this.req.token.id,
          info:
            "Updated a user of ID :" + inputs.id + " : No change in user level",
        });
      }

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/edit-user",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
