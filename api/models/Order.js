/**
 * PurchaseOrder.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "orders",

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    code: { type: "string", required: true },
    patient_id: { model: "Patient" },
    branch_id: { model: "Branch" },
    stock_id: { model: "Stock" },
    date: { type: "ref", columnType: "datetime" },
    frame_price: { type: "number", required: true },
    lense_price: { type: "number", required: true },
    price: { type: "number", required: true },
    frame_discount: { type: "number", required: true },
    lense_discount: { type: "number", required: true },
    discounted_price: { type: "number", required: true },
    status: { type: "number", defaultsTo: 0 },
    invoice_id: { model: "Invoice" },
    created_on: { type: "ref", columnType: "datetime", autoCreatedAt: true },
    created_by: { model: "User" },

    // -2 - cancelled
    // 0 - pending / took the order
    // 2 - confirmed
    // 4 - sent to the workshop
    // 6 - received from the workshop
    // 10 - delivered to the customer

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
};

// CREATE TABLE `branches` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
//   `status` int NOT NULL DEFAULT '0',
//   `created_by` int DEFAULT NULL,
//   `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// ALTER TABLE `stocks` ADD `available_no_of_units` INT  NOT NULL AFTER `no_of_units`;

// INSERT INTO `code_incrementals` (`type`, `current_no`)
// VALUES
// 	('ORDR', 1);

// CREATE TABLE `orders` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `code` VARCHAR(100) NOT NULL,
//   `patient_id` INT NOT NULL,
//   `date` DATETIME NOT NULL,
//   `branch_id` INT NOT NULL,
//   `stock_id` INT NOT NULL,
//   `lense_price` DECIMAL(10,2) NOT NULL,
//   `price` DECIMAL(10,2) NOT NULL,
//   `discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
//   `discounted_price` DECIMAL(10,2) NOT NULL,
//   `status` INT NOT NULL,
//   `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
//   `created_by` INT DEFAULT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `order_lenses` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `order_id` INT NOT NULL,
//   `lense_id` INT NOT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `workflow_log` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
//   `f_key` int NOT NULL,
//   `changed_on` datetime DEFAULT CURRENT_TIMESTAMP,
//   `from_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
//   `to_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
//   `hold_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
//   `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
//   `changed_by` int NOT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// ALTER TABLE `orders` ADD `invoice_id` INT  DEFAULT NULL  AFTER `status`;
