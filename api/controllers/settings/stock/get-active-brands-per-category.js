module.exports = {
  friendlyName: "Get Active Brands",

  description: "",

  inputs: {
    category_id: {
      required: true,
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var brand_query =
        "SELECT t2.* from brand_categories t1 " +
        "LEFT JOIN brands t2 ON t2.id = t1.brand " +
        "WHERE t1.category = " +
        inputs.category_id +
        " AND t2.status = 1;";

      var brands = await sails.sendNativeQuery(brand_query);

      brands = brands.rows;

      return exits.success({
        status: true,
        brands: brands,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/supplier/get-active-brands",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
