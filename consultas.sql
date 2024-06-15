-- Active: 1713570938137@@127.0.0.1@5432@bancosolarv2
CREATE DATABASE bancosolarv2;
CREATE TABLE usuarios (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0)
);

CREATE TABLE transferencias (
id SERIAL PRIMARY KEY,
emisor INT,
receptor INT,
monto FLOAT,
fecha TIMESTAMP,
FOREIGN KEY (emisor) REFERENCES usuarios(id) ON DELETE CASCADE,
FOREIGN KEY (receptor) REFERENCES usuarios(id) ON DELETE CASCADE
);

SELECT * FROM usuarios;
SELECT * FROM transferencias;
-- SE ALTERA LA TABLA TRANSFERENCIAS:
ALTER TABLE transferencias ALTER COLUMN fecha SET DEFAULT CURRENT_TIMESTAMP;