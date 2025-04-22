-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema railway
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema railway
-- -----------------------------------------------------
USE `railway`;

-- -----------------------------------------------------
-- Table `railway`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `railway`.`trip_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`trip_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL,
  `image` VARCHAR(400) NULL,
  `where` VARCHAR(100) NULL,
  `when` VARCHAR(45) NULL,
  `who` VARCHAR(45) NULL,
  `how` VARCHAR(45) NULL,
  `rating` INT NULL,
  `notes` VARCHAR(200) NULL,
  `gear` VARCHAR(45) NULL,
  `quiver` VARCHAR(45) NULL,
  `duration` INT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_trip_log_users_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_trip_log_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `railway`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;