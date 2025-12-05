module.exports = {
  friendlyName: "Get all paged users",

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
    if (inputs.event.sortField == "firstname") {
      order_by = " t1.firstname ";
    } else if (inputs.event.sortField == "lastname") {
      order_by = " t1.lastname ";
    } else if (inputs.event.sortField == "userlevel") {
      order_by = " t2.rolename ";
    } else if (inputs.event.sortField == "designation") {
      order_by = " t1.designation ";
    } else if (inputs.event.sortField == "status") {
      order_by = " t1.disabled ";
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
          "  WHERE (t1.firstname LIKE '%" +
          search_text +
          "%' OR t1.lastname LIKE '%" +
          search_text +
          "%' OR t2.rolename LIKE '%" +
          search_text +
          "%' OR t1.designation LIKE '%" +
          search_text +
          "%') ";
      }
    }

    var lenses_sql =
      "SELECT t1.*, t2.rolename from users t1 " +
      "LEFT JOIN user_roles t2 ON t2.id = t1.userlevel " +
      global_search_filter +
      " ORDER by " +
      order_by +
      order_method +
      " LIMIT " +
      offset +
      "," +
      rows;

    var users = await sails.sendNativeQuery(lenses_sql);
    users = users.rows;

    var lenses_count_sql =
      "SELECT COUNT(*) as no_of_users from users t1 " +
      "LEFT JOIN user_roles t2 ON t2.id = t1.userlevel " +
      global_search_filter;

    var no_of_users = await sails.sendNativeQuery(lenses_count_sql);
    no_of_users = no_of_users.rows[0].no_of_users;

    return exits.success({
      users: users,
      no_of_users: no_of_users,
    });
  },
};
