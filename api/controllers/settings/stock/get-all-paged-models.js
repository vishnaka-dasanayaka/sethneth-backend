module.exports = {
  friendlyName: "Get all paged models",

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
    var order_by = " t1.id ";
    if (inputs.event.sortField == "name") {
      order_by = " t1.name ";
    } else if (inputs.event.sortField == "brand") {
      order_by = " t2.name ";
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
          "  WHERE (t1.name LIKE '%" +
          search_text +
          "%' OR t2.name LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var purchase_orders_sql =
      "SELECT t1.*, t2.name AS brand_name from models t1 " +
      "LEFT JOIN brands t2 ON t2.id = t1.brand " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var models = await sails.sendNativeQuery(purchase_orders_sql);
    models = models.rows;

    var clients_count_sql =
      "SELECT COUNT(*) as no_of_purchase_orders from models t1 " +
      "LEFT JOIN brands t2 ON t2.id = t1.brand " +
      global_search_filter;

    var no_of_models = await sails.sendNativeQuery(clients_count_sql);
    no_of_models = no_of_models.rows[0].no_of_purchase_orders;

    return exits.success({
      models: models,
      no_of_models: no_of_models,
    });
  },
};
