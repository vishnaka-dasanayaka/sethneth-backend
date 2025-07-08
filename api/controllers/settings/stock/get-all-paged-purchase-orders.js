module.exports = {
  friendlyName: "Get all paged purchase_orders",

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
    if (inputs.event.sortField == "supplier") {
      order_by = " t2.name ";
    } else if (inputs.event.sortField == "date") {
      order_by = " t1.date ";
    } else if (inputs.event.sortField == "amount") {
      order_by = " t1.amount ";
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
          "%' OR t1.amount LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var purchase_orders_sql =
      "SELECT t1.*, t2.name AS supplier_name from purchase_orders t1 " +
      "LEFT JOIN suppliers t2 ON t2.id = t1.supplier " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var purchase_orders = await sails.sendNativeQuery(purchase_orders_sql);
    purchase_orders = purchase_orders.rows;

    var clients_count_sql =
      "SELECT COUNT(*) as no_of_purchase_orders from purchase_orders t1 " +
      "LEFT JOIN suppliers t2 ON t2.id = t1.supplier " +
      global_search_filter;

    var purchase_orders_count = await sails.sendNativeQuery(clients_count_sql);
    purchase_orders_count = purchase_orders_count.rows[0].no_of_purchase_orders;

    return exits.success({
      purchase_orders: purchase_orders,
      no_of_purchase_orders: purchase_orders_count,
    });
  },
};
