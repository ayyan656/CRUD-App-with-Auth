const express = require('express');
const { signup, login, addUser, getUsers, updateUser, deleteUser, getsignupUsers, logout, dashboard } = require('../controller/auth-controllers'); // Correct path
const router = express.Router();



router.post('/signup', signup);
router.get('/dashboard', dashboard);
router.get('/getsignupUsers', getsignupUsers);
router.post('/login', login);
router.post('/logout', logout); 
router.post('/addUser', addUser);
router.get('/getUsers', getUsers);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
