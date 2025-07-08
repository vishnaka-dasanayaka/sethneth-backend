module.exports = {
  friendlyName: "Add Category",

  description: "",

  inputs: {
    category: {
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

      let existing_category = null;

      if (inputs.category !== null && inputs.category !== undefined) {
        existing_category = await Category.findOne({
          name: inputs.category,
        });
      }

      if (existing_category) {
        return exits.success({
          status: false,
          err: "A Category find with the same name",
        });
      }

      var category = await Category.create({
        name: inputs.category,
        created_by: this.req.token.id,
      }).fetch();

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a category of ID :" + category.id,
      });

      return exits.success({
        status: true,
        category: category,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/stock/create-category",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
