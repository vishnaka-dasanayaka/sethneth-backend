module.exports = {
  friendlyName: "Add Note",

  description: "",

  inputs: {
    type: {
      required: true,
      type: "string",
    },
    note: {
      required: true,
      type: "string",
    },
    f_key: {
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

      var note = await Note.create({
        type: inputs.type,
        note: inputs.note,
        f_key: inputs.f_key,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info:
          "Note added to the type :" + note.type + " of f_key : " + note.f_key,
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
