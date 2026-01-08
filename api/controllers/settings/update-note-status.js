module.exports = {
  friendlyName: "Update Note Status",

  description: "",

  inputs: {
    id: {
      required: true,
      type: "number",
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

      let existing_note = null;

      if (inputs.id !== null && inputs.id !== undefined) {
        existing_note = await Note.findOne({
          id: inputs.id,
        });
      }

      if (!existing_note) {
        return exits.success({
          status: false,
          err: "Note not found",
        });
      }

      var note = await Note.updateOne({
        id: inputs.id,
      }).set({ status: inputs.status });

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Note status updated to :" + inputs.status,
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
        path: "api/v1/settings/add-note",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
