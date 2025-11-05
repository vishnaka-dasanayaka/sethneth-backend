module.exports = {
  friendlyName: "Get all paged stocks",

  description: "",

  inputs: {
    offset: {
      required: true,
      type: "number",
    },
    rows: {
      required: true,
      type: "number",
    },
    event: {
      required: true,
      type: "ref",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    var offset = inputs.event.first;
    var rows = inputs.event.rows;

    // sorting
    var order_by = " t1.code ";
    if (inputs.event.sortField == "category") {
      order_by = " t2.name ";
    } else if (inputs.event.sortField == "brand") {
      order_by = " t3.name ";
    } else if (inputs.event.sortField == "model") {
      order_by = " t4.name ";
    } else if (inputs.event.sortField == "supplier") {
      order_by = " t5.name ";
    } else if (inputs.event.sortField == "no_of_units") {
      order_by = " t1.no_of_units ";
    } else if (inputs.event.sortField == "available_no_of_units") {
      order_by = " t1.available_no_of_units ";
    } else if (inputs.event.sortField == "status") {
      order_by = " t1.status ";
    }

    var order_method = " ASC ";
    if (inputs.event.sortOrder == -1) {
      order_method = " DESC ";
    }

    var global_search_filter = "";
    if (inputs.event.filters.global) {
      if (inputs.event.filters.global.matchMode == "contains") {
        var search_text = inputs.event.filters.global.value;
        global_search_filter =
          "  WHERE (t2.name LIKE '%" +
          search_text +
          "%' OR t1.code LIKE '%" +
          search_text +
          "%' OR t3.name LIKE '%" +
          search_text +
          "%' OR t4.name LIKE '%" +
          search_text +
          "%' OR t5.name LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var stocks_sql =
      "SELECT t1.*, t2.name AS category_name, t3.name AS brand_name, t4.name AS model_name, t5.name AS supplier_name from stocks t1 " +
      "LEFT JOIN categories t2 ON t2.id = t1.category " +
      "LEFT JOIN brands t3 ON t3.id = t1.brand " +
      "LEFT JOIN models t4 ON t4.id = t1.model " +
      "LEFT JOIN suppliers t5 ON t5.id = t1.supplier " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var stocks = await sails.sendNativeQuery(stocks_sql);
    stocks = stocks.rows;

    var stocks_count_sql =
      "SELECT COUNT(*) as no_of_purchase_orders from stocks t1 " +
      "LEFT JOIN categories t2 ON t2.id = t1.category " +
      "LEFT JOIN brands t3 ON t3.id = t1.brand " +
      "LEFT JOIN models t4 ON t4.id = t1.model " +
      "LEFT JOIN suppliers t5 ON t5.id = t1.supplier " +
      global_search_filter;

    var no_of_stocks = await sails.sendNativeQuery(stocks_count_sql);
    no_of_stocks = no_of_stocks.rows[0].no_of_purchase_orders;

    return exits.success({
      stocks: stocks,
      no_of_stocks: no_of_stocks,
    });
  },
};
