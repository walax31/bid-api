CREATE DATABASE IF NOT EXISTS `bidDB`;

USE `bidDB`;

DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `login`;
DROP TABLE IF EXISTS `bid`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `product_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `payments`;

CREATE TABLE `login`(
`customer_id` AUTO_INCREMENT INT NOT NULL ,
`username`VARCHAR(120) NOT NULL,
`password`VARCHAR(120) NOT NULL,
`email`VARCHAR(120) NOT NULL UNIQUE,

PRIMARY KEY(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `customers`(
`customer_id`INT NOT NULL ,
`first_name`VARCHAR(120) NOT NULL,
`last_name`VARCHAR(120) NOT NULL,
`address`VARCHAR(120) NOT NULL,
`phone_number`INT(10) NOT NULL UNIQUE,

PRIMARY KEY(`customer_id`),
CONSTRAINT `login_ibfk_1` FOREIGN KEY(`customer_id`)REFERENCES `login`(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `bid`(
`customer_id`INT NOT NULL ,
`product_id`INT NOT NULL,
`amount`INT NOT NULL,
`timestamp`TIMESTAMP,

PRIMARY KEY(`product_id`),
CONSTRAINT `products_ibfk_1` FOREIGN KEY(`product_id`)REFERENCES `products`(`product_id`),
CONSTRAINT `customers_ibfk_2` FOREIGN KEY(`customer_id`)REFERENCES `customers`,`customer_id`
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `products`(
`customer_id`INT NOT NULL ,
`product_id`INT  NOT NULL AUTO_INCREMENT ,
`product_name`VARCHAR(120) NOT NULL,
`countdown`TIMESTAMP,
`stock`INT NOT NULL,

PRIMARY KEY(`product_id`),
CONSTRAINT `customers_ibfk_1` FOREIGN KEY(`customer_id`)REFERENCES `customers`(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `products_details`(
`product_id`INT  NOT NULL  ,
`price`INT NOT NULL,
`description`VARCHAR(120) NOT NULL,

PRIMARY KEY(`product_id`),
CONSTRAINT `products_ibfk_1` FOREIGN KEY(`product_id`)REFERENCES `products`,(`product_id`),
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `orders`(
`order_id`INT  NOT NULL AUTO_INCREMENT ,
`customer_id`INT NOT NULL ,

PRIMARY KEY(`order_id`),
CONSTRAINT `customers_ibfk_1` FOREIGN KEY(`customer_id`)REFERENCES `customers`(`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `order_details`(
`order_id`INT  NOT NULL  ,
`product_id`INT  NOT NULL  ,
`quantity`INT NOT NULL ,

PRIMARY KEY(`order_id`),
CONSTRAINT `orders_ibfk_1` FOREIGN KEY(`order_id`)REFERENCES `orders`(`order_id`),
CONSTRAINT `products_ibfk_2` FOREIGN KEY(`product_id`)REFERENCES `products`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

CREATE TABLE `payments`(
`order_id`INT  NOT NULL  ,
`method`VARCHAR(255) NOT NULL ,
`status`VARCHAR(255) NOT NULL ,
`total`INT NOT NULL ,

PRIMARY KEY(`order_id`),
CONSTRAINT `orders_ibfk_1` FOREIGN KEY(`order_id`)REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4;

