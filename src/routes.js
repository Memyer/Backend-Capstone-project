const { registerUser, loginUser, readUser, updateUser, deleteUser } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerUser,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginUser,
  },
  {
    method: 'GET',
    path: '/readUser',
    handler: readUser,
  },
  {
    method: 'PUT',
    path: '/updateUser',
    handler: updateUser,
  },
  {
    method: 'DELETE',
    path: '/deleteUser',
    handler: deleteUser,
  },
];

module.exports = routes;
