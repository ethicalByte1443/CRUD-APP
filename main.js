// const express = require('express')
// const app = express()
// const morgan = require('morgan')
// const userModel = require('./models/user')
// const connection = require('./config/db')


// app.use(morgan('dev'))
// app.set('view engine', 'ejs')
// app.use(express.static('public'))
// app.use(express.json())
// app.use(express.urlencoded({extended : true}))


// app.get('/', (req, res) => {
//     res.render('index')
// })


// // User Create Logic
// app.get('/create', (req, res) => {
//     res.render('create');
// });


// app.post('/create', async (req, res) => {
//     const { username, email, password } = req.body;
//     // Add logic to save user details to JSON or database
//     await userModel.create({
//         username: username,
//         email: email,
//         password: password
//     })
//     console.log(req.body);
//     res.send('User created successfully');
// });


// // user read logic
// app.get('/read', async (req, res) => {
//     try {
//         const users = await User.find(); // Fetch all users from MongoDB
//         res.render('read', { users });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).send('Error fetching users');
//     }
// });







// app.listen(3000, console.log("Server started at port - http://localhost:3000"))

const express = require('express');
const app = express();
const morgan = require('morgan');
const userModel = require('./models/user');
const connection = require('./config/db');
const bcrypt = require('bcrypt');

// Middleware
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// User Create Logic
app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        res.send("User Created Successfully")
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// User Read Logic
app.get('/read', async (req, res) => {
    try {
        const users = await userModel.find(); // Fetch all users from MongoDB
        res.render('read', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});


app.post('/delete', async (req, res) => {
    try {
        const { id } = req.body; // Extract the user ID from the form
        await userModel.findByIdAndDelete(id); // Delete the user from MongoDB
        console.log(`User with ID ${id} deleted.`);
        res.redirect('/read'); // Redirect back to the list of users
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

// Update





// Start Server
app.listen(3000, () => console.log("Server started at http://localhost:3000"));
