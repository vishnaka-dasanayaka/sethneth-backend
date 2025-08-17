module.exports = {
  friendlyName: "Get all paged models",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      var stock_sql =
        "SELECT t1.* , t2.name as model_name, t3.name as brand_name, t4.name as category_name FROM stocks t1 " +
        "LEFT JOIN models t2 ON t1.model = t2.id " +
        "LEFT JOIN brands t3 ON t3.id = t1.brand " +
        "LEFT JOIN categories t4 ON t4.id = t1.category " +
        "WHERE t2.status=1;";

      var stocks = await sails.sendNativeQuery(stock_sql);

      stocks = stocks.rows;

      return exits.success({
        status: true,
        models: stocks,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/stock/get-all-active-models-with-stock",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
