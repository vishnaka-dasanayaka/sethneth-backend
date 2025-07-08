module.exports = {
  friendlyName: "Get Active Categories",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var categories = await Category.find({ status: 1 });

      return exits.success({
        status: true,
        categories: categories,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-supplier",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
