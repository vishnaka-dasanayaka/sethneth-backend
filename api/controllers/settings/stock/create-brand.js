module.exports = {
  friendlyName: "Add Brand",

  description: "",

  inputs: {
    brand: {
      required: true,
      type: "string",
    },

    category: {
      type: "ref",
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

      let existing_brand = null;

      if (inputs.brand !== null && inputs.brand !== undefined) {
        existing_brand = await Brand.findOne({
          name: inputs.brand,
        });
      }

      if (existing_brand) {
        return exits.success({
          status: false,
          err: "A Brand find with the same name",
        });
      }

      var brand = await Brand.create({
        name: inputs.brand,
        created_by: this.req.token.id,
      }).fetch();

      for (var item of inputs.category) {
        await BrandCategory.create({ brand: brand.id, category: item });
      }

      // System Log record
      await SystemLog.create({
        userid: this.req.token.id,
        info: "Created a brand of ID :" + brand.id,
      });

      return exits.success({
        status: true,
        brand: brand,
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
