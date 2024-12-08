const express = require('express');
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controller/userController');
const checkPermission = require('../middleware/Admin');  // Import the permission middleware
const User = require('../models/User');
const router = express.Router();

// Dummy role assignment (in a real-world case, you'd get this info from a session, JWT, or DB)
const user = { role: 'admin' };  // This can be replaced with actual user data from somewhere

// Route for creating a user - requires 'create_user' permission
router.post('/create', checkPermission('create_user', user), createUser);

// Route for getting all users - requires 'view_users' permission
router.get('/', checkPermission('view_users', user), getUsers);

// Route for getting a user by ID - requires 'view_user' permission
router.get('/:id', checkPermission('view_user', user), getUserById);

// Route for updating a user by ID - requires 'edit_user' permission
router.put('/:id', checkPermission('edit_user', user), updateUser);

// Route for deleting a user by ID - requires 'delete_user' permission
router.delete('/:id', checkPermission('delete_user', user), deleteUser);


module.exports = router;
