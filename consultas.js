const pool = require("./bd");

// Función para obtener todos los usuarios
const getUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    return res.rows;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Función para obtener todas las transferencias
const getTransferencias = async () => {
  try {
    const res = await pool.query(`
      SELECT 
        t.id, 
        t.monto, 
        t.fecha, 
        ue.nombre AS emisor, 
        ur.nombre AS receptor
      FROM 
        transferencias t
      JOIN 
        usuarios ue ON t.emisor = ue.id
      JOIN 
        usuarios ur ON t.receptor = ur.id
    `);
    return res.rows;
  } catch (error) {
    console.error("Error al obtener las transferencias:", error);
    throw error;
  }
};

const crearUsuario = async (nombre, balance) => {
  // verificar que el nombre solo contenga letras
  const regex = /^[A-Za-z]+$/;

  // Validar el nombre
  if (!regex.test(nombre)) {
    alert(error, "El nombre debe contener solo letras.");
    return;
  }

  try {
    const res = await pool.query(
      "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
      [nombre, balance]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return { error: "Error al crear el usuario." };
  }
};

// Función para actualizar un usuario
const actualizarUsuario = async (id, nombre, balance) => {
  try {
    const res = await pool.query(
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
      [nombre, balance, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

// Función para eliminar un usuario
const eliminarUsuario = async (id) => {
  try {
    const res = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return res.rowCount > 0;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

// Función para obtener el ID de un usuario a partir de su nombre
const obtenerIdUsuarioPorNombre = async (nombre) => {
  try {
    const res = await pool.query("SELECT id FROM usuarios WHERE nombre = $1", [
      nombre,
    ]);
    return res.rows[0].id;
  } catch (error) {
    console.error("Error al obtener el ID del usuario:", error);
    throw error;
  }
};

// Función para crear una nueva transferencia utilizando los nombres de los usuarios
const crearTransferencia = async (emisorNombre, receptorNombre, monto) => {
  try {
    // Obtener los IDs de los usuarios a partir de sus nombres
    const emisorId = await obtenerIdUsuarioPorNombre(emisorNombre);
    const receptorId = await obtenerIdUsuarioPorNombre(receptorNombre);

    // Actualizar los balances de los usuarios
    await pool.query(
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2",
      [monto, emisorId]
    );
    await pool.query(
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2",
      [monto, receptorId]
    );

    // Insertar la transferencia en la base de datos con la fecha actual
    const res = await pool.query(
      "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [emisorId, receptorId, monto]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error al crear la transferencia:", error);
    throw error;
  }
};

module.exports = {
  getUsuarios,
  getTransferencias,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearTransferencia,
};