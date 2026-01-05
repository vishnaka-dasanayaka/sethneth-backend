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
  },

  exits: {},

  fn: async function (inputs, exits) {
    var result = await sails.helpers.user.updatePermissionGroup.with({
      id: inputs.id,
      state: inputs.state,
      userlevel: inputs.userlevel,
      logged_user: this.req.token.id,
    });

    return exits.success(result);
  },
};
