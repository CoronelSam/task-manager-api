-- =============================================================
-- Task Manager API - Script SQL (alternativa a las migraciones)
-- Uso: mysql -u root -p < database/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS task_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_manager;

CREATE TABLE IF NOT EXISTS Users (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL,             -- hash bcrypt, nunca texto plano
  createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Tasks (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NULL,
  status       ENUM('pending', 'in-progress', 'completed') NOT NULL DEFAULT 'pending',
  userId       INT UNSIGNED NOT NULL,
  createdAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY tasks_user_id_idx (userId),
  CONSTRAINT tasks_user_id_fk FOREIGN KEY (userId)
    REFERENCES Users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
