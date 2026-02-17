const SpeakEasy = require("speakeasy");

module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    username: {
      required: true,
      type: "string",
    },

    password: {
      required: true,
      type: "string",
    },
    step: {
      required: true,
      type: "number",
    },
    token: {
      allowNull: true,
      type: "string",
    },
  },

  exits: {
    OtherError: {
      responseType: "HandleError",
    },
  },

  fn: async function (inputs, exits) {
    // Look up by the username.
    var userRecord = await User.findOne({
      username: inputs.username,
    });

    // If there was no matching user, respond thru the exit.
    if (!userRecord) {
      return exits.OtherError({
        status: false,
        err: "Invalid username or password. Please try again.",
      });
    }

    // if (sails.config.environment === "production") {
    //   if (userRecord.allowed_ips != null) {
    //     if (
    //       this.req.headers["x-real-ip"] &&
    //       this.req.headers["x-real-ip"] != null
    //     ) {
    //       userRecord.allowed_ips = userRecord.allowed_ips.split(",");
    //       if (!userRecord.allowed_ips.includes(this.req.headers["x-real-ip"])) {
    //         return exits.OtherError({
    //           status: false,
    //           err: "Login IP address is not a authorized",
    //         });
    //       }
    //     } else {
    //       return exits.OtherError({
    //         status: false,
    //         err: "Invalid login IP Details.",
    //       });
    //     }
    //   }
    // }

    // If the user is disabled, prevent log in
    if (userRecord.disabled == 1) {
      return exits.OtherError({
        status: false,
        err: "This User has been disabled by Admin",
      });
    }

    // If the password doesn't match, then also exit thru exit.
    await sails.helpers.passwords
      .checkPassword(inputs.password, userRecord.password)
      .intercept("incorrect", (err) => {
        return exits.OtherError({
          status: false,
          err: "Invalid username or password. Please try again.",
        });
      });

    var two_factor_enabled = 0;

    if (inputs.step == 1) {
      if (userRecord.two_factor_status == 0) {
        // Generate Token if password match
        var tokenIssued = await sails.helpers.jwTokenIssue({
          id: userRecord.id,
          userlevel: userRecord.userlevel,
          store: userRecord.store,
        });
        two_factor_enabled = 0;
      } else {
        var tokenIssued = {};
        two_factor_enabled = 1;
      }
    } else if (inputs.step == 2) {
      // validate token
      var userToken = inputs.token;

      var base32secret = userRecord.two_factor_secret_string;

      var verified = SpeakEasy.totp.verify({
        secret: base32secret,
        encoding: "base32",
        token: userToken,
      });

      if (verified) {
        var tokenIssued = await sails.helpers.jwTokenIssue({
          id: userRecord.id,
          userlevel: userRecord.userlevel,
          store: userRecord.store,
        });
      } else {
        var recovery_data = await TwoFactorData.findOne({
          user_id: userRecord.id,
        });

        var recovery_codes = [];
        if (recovery_data && recovery_data.two_factor_recovery != null) {
          recovery_codes = JSON.parse(recovery_data.two_factor_recovery);
        }
        var rec_index = recovery_codes.findIndex((i) => i === userToken);

        if (rec_index != -1) {
          var tokenIssued = await sails.helpers.jwTokenIssue({
            id: userRecord.id,
            userlevel: userRecord.userlevel,
            store: userRecord.store,
          });

          recovery_codes.splice(rec_index, 1);

          // update recovery data
          await TwoFactorData.update({ id: recovery_data.id }).set({
            two_factor_recovery: JSON.stringify(recovery_codes),
          });
        } else {
          return exits.OtherError({
            status: false,
            err: "Invalid token. Please check your token and try again",
          });
        }
      }
    }

    await User.updateOne({ id: userRecord.id }).set({
      session_confirmed_branch: 0,
    });

    await LoginHistory.create({
      userid: userRecord.id,
      ip: this.req.ip,
      req_headers: JSON.stringify(this.req.headers),
    });

    await sails.helpers.permissionRoller();

    //this.req.session.userId = userRecord.id;

    // System Log record
    // await SystemLog.create({
    //   userid: this.req.token.id,
    //   info: "User:" + userRecord.id + " logged in."
    // });

    // Send success response (this is where the session actually gets persisted)
    return exits.success({
      status: true,
      body: {
        id: userRecord.id,
        username: userRecord.username,
        firstName: userRecord.firstname,
        lastName: userRecord.lastname,
        token: tokenIssued,
        two_factor_enabled: two_factor_enabled,
      },
    });
  },
};
