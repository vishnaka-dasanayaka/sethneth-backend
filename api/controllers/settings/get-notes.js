module.exports = {
  friendlyName: "Add Note",

  description: "",

  inputs: {
    type: {
      required: true,
      type: "string",
    },
    f_key: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var notes = await Note.find({
        type: inputs.type,
        f_key: inputs.f_key,
        status: 2,
      })
        .populate("created_by")
        .populate("updated_by");

      // System Log record

      return exits.success({
        status: true,
        notes: notes,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/get-notes",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
