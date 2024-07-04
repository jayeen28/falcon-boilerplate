-- Demo tution database
USE tution;

DELIMITER $$

DROP PROCEDURE IF EXISTS register$$
CREATE PROCEDURE register(
	p_first_name VARCHAR(50),
	p_last_name  VARCHAR(50),
	p_phone 	 VARCHAR(50),
	p_email 	 VARCHAR(50),
	p_password 	 VARCHAR(60),
    p_role		 VARCHAR(50)
)
BEGIN
	-- variables to hold the role_id and user_id
	DECLARE v_role_id INT;
    DECLARE v_user_id INT;

    IF p_role NOT IN ('teacher','student') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid role provided. For this procedure role should be student or teacher';
    ELSE
		-- Get role_id from roles and set value to v_role_id
		SELECT role_id INTO v_role_id FROM roles WHERE name = p_role LIMIT 1;

        IF v_role_id IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Role not found using the input';
        ELSE
			INSERT INTO users(first_name, last_name, email, password, phone, role_id)
            VALUES (p_first_name, p_last_name, p_email, p_password, p_phone, v_role_id);
            SET v_user_id = LAST_INSERT_ID();

            IF p_role = 'teacher' THEN
				INSERT INTO teachers(user_id) VALUES(v_user_id);
            ELSEIF p_role = 'student' THEN
				INSERT INTO students(user_id) VALUES(v_user_id);
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;