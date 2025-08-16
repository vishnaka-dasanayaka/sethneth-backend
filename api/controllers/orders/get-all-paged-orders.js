module.exports = {
  friendlyName: "Get all paged orders",

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
    if (inputs.event.sortField == "patient") {
      order_by = " t2.name ";
    } else if (inputs.event.sortField == "date") {
      order_by = " t1.date ";
    } else if (inputs.event.sortField == "model") {
      order_by = " t4.name ";
    } else if (inputs.event.sortField == "price") {
      order_by = " t1.discounted_price ";
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
          "  WHERE (t1.code LIKE '%" +
          search_text +
          "%' OR t2.name LIKE '%" +
          search_text +
          "%' OR t4.name LIKE '%" +
          search_text +
          "%' OR t1.discounted_price LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var patients_sql =
      "SELECT t1.*, t2.name as patient_name, t4.name as model_name from orders t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient_id " +
      "LEFT JOIN stocks t3 ON t3.id = t1.stock_id " +
      "LEFT JOIN models t4 ON t4.id = t3.model " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var orders = await sails.sendNativeQuery(patients_sql);
    orders = orders.rows;

    var patients_count_sql =
      "SELECT COUNT(*) as no_of_orders from orders t1 " +
      "LEFT JOIN patients t2 ON t2.id = t1.patient_id " +
      "LEFT JOIN stocks t3 ON t3.id = t1.stock_id " +
      "LEFT JOIN models t4 ON t4.id = t3.model " +
      global_search_filter;

    var no_of_orders = await sails.sendNativeQuery(patients_count_sql);
    no_of_orders = no_of_orders.rows[0].no_of_orders;

    return exits.success({
      orders: orders,
      no_of_orders: no_of_orders,
    });
  },
};
