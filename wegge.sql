DROP DATABASE wegge;

CREATE DATABASE wegge;

USE wegge;

CREATE TABLE `levels` (
  `level_id` INT NOT NULL AUTO_INCREMENT,
  `level_name` VARCHAR(50) NULL,
  `level_json` TEXT NULL,
  PRIMARY KEY (`level_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* 

	alter table levels add column `level_name` VARCHAR(50) NULL; 

*/

CREATE TABLE `resources` (
  `resource_id` INT NOT NULL AUTO_INCREMENT,
  `resource_name` VARCHAR(50) NULL,
  `resource_json` TEXT NULL,
  PRIMARY KEY (`resource_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

