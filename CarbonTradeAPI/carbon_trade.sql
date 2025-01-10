/*
 Navicat Premium Data Transfer

 Source Server         : 阿里云 2c2g
 Source Server Type    : MySQL
 Source Server Version : 80034 (8.0.34)
 Source Schema         : carbon_trade

 Target Server Type    : MySQL
 Target Server Version : 80034 (8.0.34)
 File Encoding         : 65001

 Date: 31/10/2024 21:26:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auctions
-- ----------------------------
DROP TABLE IF EXISTS `auctions`;
CREATE TABLE `auctions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `trade_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `sell_amount` int NULL DEFAULT NULL,
  `minimum_bid_amount` int NULL DEFAULT NULL,
  `init_price_unit` int NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `start_time` datetime NULL DEFAULT NULL,
  `end_time` datetime NULL DEFAULT NULL,
  `transaction_hash` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bidding
-- ----------------------------
DROP TABLE IF EXISTS `bidding`;
CREATE TABLE `bidding`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `auction_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `bidding_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `bidding_msg` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `allocate_amount` int NULL DEFAULT 0,
  `additional_amount_to_pay` int NULL DEFAULT 0,
  `bidding_status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `bidding_time` datetime NULL DEFAULT NULL,
  `hash` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for penalty
-- ----------------------------
DROP TABLE IF EXISTS `penalty`;
CREATE TABLE `penalty`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `penalty_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `public_key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `penalty` int NULL DEFAULT NULL,
  `penalty_status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `penalty_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `public_key_unique`(`public_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for reports
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `public_key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `report_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `report` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `report_status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `report_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `public_key_unique`(`public_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `public_key` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `report_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `penalty_id` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `company_msg` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `extra_msg` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `create_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `public_key_unique`(`public_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
