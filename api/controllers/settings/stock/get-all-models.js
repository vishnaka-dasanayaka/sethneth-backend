module.exports = {
  friendlyName: "Get all paged models",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    var models = await Model.find();

    return exits.success({
      status: true,
      models: models,
    });
  },
};
