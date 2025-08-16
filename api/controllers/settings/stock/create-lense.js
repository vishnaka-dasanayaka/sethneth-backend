module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    lense: {
      required: true,
      type: "string",
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

      let existing_lense = null;

      if (inputs.lense !== null && inputs.lense !== undefined) {
        existing_lense = await Lense.findOne({
          name: inputs.lense,
        });
      }

      if (existing_lense) {
        return exits.success({
          status: false,
          err: "A Lense find with the same name",
        });
      }

      var lense = await Lense.create({
        name: inputs.lense,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a lense of ID :" + lense.id,
      });

      return exits.success({
        status: true,
        lense: lense,
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
