DROP DATABASE wegge;

CREATE DATABASE wegge;

USE wegge;

CREATE TABLE `scenes` (
  `scene_id` INT NOT NULL AUTO_INCREMENT,
  `scene_name` VARCHAR(45) NOT NULL,
  `scene_json` TEXT NULL,
  PRIMARY KEY (`scene_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `resources` (
  `resource_id` INT NOT NULL AUTO_INCREMENT,
  `resource_json` TEXT NULL,
  PRIMARY KEY (`resource_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;