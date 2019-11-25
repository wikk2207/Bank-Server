DROP DATABASE bankdb;
CREATE DATABASE IF NOT EXISTS bankdb;

USE bankdb;

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, 
						login VARCHAR(255), 
						password CHAR(128),
						email VARCHAR(255), 
						account_number CHAR(26));

CREATE TABLE IF NOT EXISTS transfers (id INT AUTO_INCREMENT PRIMARY KEY,
						 amount FLOAT, 
						 title VARCHAR(255), 
						 account_number CHAR(26),
                         created DATETIME);
                         
CREATE TABLE IF NOT EXISTS user_transfer (id_user INT, id_transfer INT);

DELIMITER $$ 
CREATE TRIGGER check_new_user BEFORE INSERT ON users
FOR EACH ROW 
BEGIN
IF EXISTS (SELECT login FROM users WHERE login=NEW.login) THEN 
	SIGNAL SQLSTATE '45000' 
	SET MESSAGE_TEXT = 'Taki login już istnieje';
	END IF;
IF EXISTS (SELECT email FROM users WHERE email=NEW.email) THEN 
SIGNAL SQLSTATE '45000' 
SET MESSAGE_TEXT = 'Już istnieje konto dla podanego adresu email.';
	END IF;
IF EXISTS (SELECT account_number FROM users WHERE account_number=NEW.account_number) THEN 
SIGNAL SQLSTATE '50000' 
SET MESSAGE_TEXT = 'Ten numer konta już istnieje w bazie.';
	END IF;
END$$
DELIMITER ;

DELIMITER $$ 
CREATE TRIGGER add_transfer BEFORE INSERT ON user_transfer
FOR EACH ROW
BEGIN
IF NOT EXISTS (SELECT id FROM users WHERE id=NEW.id_user) THEN
	SIGNAL SQLSTATE '46000'
    SET MESSAGE_TEXT = 'Taki użytkownik nie istnieje';
ELSEIF NOT EXISTS (SELECT id FROM transfers WHERE id=NEW.id_transfer) THEN
	SIGNAL SQLSTATE '46000'
    SET MESSAGE_TEXT = 'Taki przelew nie istnieje';
    END IF;
END $$
DELIMITER ;

