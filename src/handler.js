
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Membuat koneksi ke database
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const registerUser = async (request, h) => {
  const {
    fullName, email, password, age, gender, weight, height,
  } = request.payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = nanoid(16);

  const connection = await mysql.createConnection(dbConfig);
  const query = 'INSERT INTO users (id, fullName, email, password, age, gender, weight, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  await connection.execute(query, [id, fullName, email, hashedPassword, age, gender, weight, height]);
  await connection.end();

  return h.response({ status: 'success', message: 'User registered successfully' }).code(201);
};

const loginUser = async (request, h) => {
  const { email, password } = request.payload;

  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  await connection.end();

  if (rows.length === 0) {
    return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
  }

  return h.response({ status: 'success', message: 'Login successful' }).code(200);
};

const readUser = async (request, h) => {
  const { email } = request.payload;

  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  await connection.end();

  if (rows.length === 0) {
    return h.response({ status: 'fail', message: 'User not found' }).code(404);
  }

  const user = rows[0];
  delete user.password; // Remove password from response

  return h.response({ status: 'success', data: user }).code(200);
};

const updateUser = async (request, h) => {
  const {
    email, fullName, age, gender, weight, height,
  } = request.payload;

  const connection = await mysql.createConnection(dbConfig);
  const query = 'UPDATE users SET fullName = ?, age = ?, gender = ?, weight = ?, height = ? WHERE email = ?';
  const [result] = await connection.execute(query, [fullName, age, gender, weight, height, email]);
  await connection.end();

  if (result.affectedRows === 0) {
    return h.response({ status: 'fail', message: 'User not found or no changes made' }).code(404);
  }

  return h.response({ status: 'success', message: 'User updated successfully' }).code(200);
};

const deleteUser = async (request, h) => {
  const { email } = request.payload;

  const connection = await mysql.createConnection(dbConfig);
  const query = 'DELETE FROM users WHERE email = ?';
  const [result] = await connection.execute(query, [email]);
  await connection.end();

  if (result.affectedRows === 0) {
    return h.response({ status: 'fail', message: 'User not found' }).code(404);
  }

  return h.response({ status: 'success', message: 'User deleted successfully' }).code(200);
};

module.exports = {
  registerUser,
  loginUser,
  readUser,
  updateUser,
  deleteUser,
};
