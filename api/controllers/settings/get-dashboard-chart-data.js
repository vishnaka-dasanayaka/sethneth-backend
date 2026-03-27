module.exports = {
  friendlyName: "Add Note",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const raw = await sails.sendNativeQuery(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
      `);

      const statusMap = {
        "-2": "Cancelled",
        0: "Pending",
        2: "Confirmed",
        4: "Sent to Workshop",
        6: "Received from Workshop",
        10: "Delivered",
      };

      // Initialize with 0s (important for missing statuses)
      let result = {
        labels: [],
        data: [],
      };

      // Create a map from DB result
      let dbMap = {};
      raw.rows.forEach((row) => {
        dbMap[row.status] = row.count;
      });

      // Build final structure in correct order
      Object.keys(statusMap).forEach((status, index) => {
        result.labels.push(statusMap[status]);
        result.data.push(dbMap[status] || 0);
      });

      // STOCK CATEGORY

      const raw_stock = await sails.sendNativeQuery(`
        SELECT c.name as category_name, SUM(s.available_no_of_units) as total_units
        FROM stocks s
        JOIN categories c ON s.category = c.id
        GROUP BY s.category, c.name
        `);

      console.log(raw_stock);

      let stock_labels = [];
      let stock_data = [];

      raw_stock.rows.forEach((row) => {
        stock_labels.push(row.category_name);
        stock_data.push(Number(row.total_units));
      });

      var stock_chart_data = {
        stock_labels: stock_labels,
        stock_data: stock_data,
      };

      return exits.success({
        status: true,
        order_chart_data: result,
        stock_chart_data: stock_chart_data,
      });
    } catch (e) {
      const errorInfo =
        e instanceof Error ? `${e.message}\n${e.stack}` : JSON.stringify(e);

      //Error Log record
      await ErrorLog.create({
        userid: 1,
        path: "api/v1/settings/get-dashboard-chart-data",
        info: errorInfo,
      });
      return exits.success({
        status: false,
        err: "An error occurred while processing your request.",
      });
    }
  },
};
