-- Demo tution database
DROP DATABASE IF EXISTS tution;
CREATE DATABASE IF NOT EXISTS tution;

USE tution;

DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles
(
	role_id TINYINT(4) PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(15) NOT NULL UNIQUE
);
INSERT INTO roles (name) VALUES('student'),('teacher');

CREATE TABLE IF NOT EXISTS users
(
	user_id	INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email	VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone	VARCHAR(50) NOT NULL UNIQUE,
    dob		DATE,
    street	VARCHAR(255),
    city	VARCHAR(50),
    zip		VARCHAR(50),
    country	VARCHAR(50),
    role_id TINYINT(4) NOT NULL,
    FOREIGN KEY fks_users_roles (role_id)
		REFERENCES roles (role_id)
			ON UPDATE CASCADE
            ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS teachers
(
	teacher_id	INT PRIMARY KEY AUTO_INCREMENT,
	user_id		INT,
	FOREIGN KEY fks_teachers_users (user_id)
		REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS students
(
	student_id	INT PRIMARY KEY AUTO_INCREMENT,
    user_id		INT,
    FOREIGN KEY fks_students_users (user_id)
		REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);