DROP DATABASE wegge;

CREATE DATABASE wegge;

USE wegge;

CREATE TABLE `levels` (
  `level_id` INT NOT NULL AUTO_INCREMENT,
  `level_json` TEXT NULL,
  PRIMARY KEY (`level_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `resources` (
  `resource_id` INT NOT NULL AUTO_INCREMENT,
  `resource_json` TEXT NULL,
  PRIMARY KEY (`resource_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* seed test data */

INSERT INTO resources (resource_json) VALUES ('');

UPDATE resources SET resource_json = '{"type":"Texture","path":"../ting/images/floor-rock1.jpg"}'
WHERE resource_id = 1;

INSERT INTO levels (level_json) VALUES ('');

UPDATE levels SET level_json = '{"type":"Level","clearColor":"#0F0F0F","ambientLight":"#F0F0F0","children":[{"type":"Axis"},{"type":"Plane","material_id":1},{"type":"Object","children":[{"type":"Plane","material_id":1,"position":{"x":500,"y":1000,"z":500}},{"type":"Object"}]} ]}'
WHERE level_id = 1;