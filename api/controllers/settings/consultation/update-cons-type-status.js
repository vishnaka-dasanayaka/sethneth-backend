module.exports = {
  friendlyName: "Add Client",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "string",
    },
    status: {
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

      var cons_type = await ConsultationType.findOne({ id: inputs.id });
      if (!cons_type) {
        return exits.success({
          status: false,
          err: "Consultation Type Not Found",
        });
      }

      await ConsultationType.updateOne({ id: inputs.id }).set({
        status: inputs.status,
      });

      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Update the status of cons_type of ID :" +
          cons_type.id +
          " to " +
          inputs.status,
      });

      return exits.success({
        status: true,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/consultation/update-cons-type-status",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
