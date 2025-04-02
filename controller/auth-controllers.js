const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure this is correctly imported
const signupuser = require('../models/user-signup'); // Ensure this is correctly imported
const mongoose = require('mongoose');// Signup Function

//signup function
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user already exists
        const alreadyExists = await signupuser.findOne({ email });
        if (alreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const signupUser = new signupuser({ name, email, password: hashedPassword });
        await signupUser.save();

        // ✅ Send success response with status 201 (Created)
        return res.status(201).json({ message: "Signup successful!" });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//dashboard function
exports.dashboard = (req, res) => {
    res.json({ message: 'Welcome to the dashboard!' });
}

// GET ALL SIGNUP USERS
exports.getsignupUsers = async (req, res) => {
    try {
        const users = await signupuser.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Signin Function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Check if user exists
        const user = await signupuser.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare Password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
        // Check if user is already logged in
         
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store session data
        req.session.user = { id: user.id, email: user.email, name: user.name }; // Store user in session

        // Set JWT as a cookie
        res.cookie("auth_token", token, {
            httpOnly: true,  // Prevents JavaScript access (more secure)
            secure: process.env.NODE_ENV === "production",  // Secure in production
            maxAge: 3600000,  // 1 hour expiration
        });

        res.status(200).json({ message: 'User logged in successfully!' });
         // Store user session

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

// Logout Function
exports.logout =  (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed!" });
        }
        
        // Clear the authentication cookie
        res.clearCookie("connect.sid"); // Clear the session cookie
        res.clearCookie("auth_token"); // Clear the JWT cookie
        // Clear session data   
        req.session = null; // Clear session data
        // Send response
        res.json({ message: "Logged out successfully!" });
    });
};

//add new user
exports.addUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};     

//get all users
 exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from request parameters
        const data = req.body; // Get the update data from request body

        // Validate if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const updateuser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updateuser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updateuser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

//delete user
 exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

