module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    cons_type: {
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

      let existing_type = null;

      if (inputs.cons_type !== null && inputs.cons_type !== undefined) {
        existing_type = await ConsultationType.findOne({
          type: inputs.cons_type,
        });
      }

      if (existing_type) {
        return exits.success({
          status: false,
          err: "A Consultation Type find with the same name",
        });
      }

      var cons_type = await ConsultationType.create({
        type: inputs.cons_type,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a cons. type of ID :" + cons_type.id,
      });

      return exits.success({
        status: true,
        cons_type: cons_type,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/consultation/create-cons-type",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
