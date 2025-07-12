module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    model: {
      required: true,
      type: "string",
    },

    brand: {
      type: "number",
      required: true,
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

      let existing_model = null;

      if (inputs.model !== null && inputs.model !== undefined) {
        existing_model = await Model.findOne({
          name: inputs.model,
        });
      }

      if (existing_model) {
        return exits.success({
          status: false,
          err: "A Model find with the same name",
        });
      }

      var model = await Model.create({
        name: inputs.model,
        brand: inputs.brand,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a model of ID :" + model.id,
      });

      return exits.success({
        status: true,
        model: model,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-brand",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
