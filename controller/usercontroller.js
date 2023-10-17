const signupcollection = require('../model/loginschema');
const bcrypt = require('bcrypt');



const popup = (req, res) => {
    console.log('popup');
    res.render('user/popup')
}


const login = (req, res) => {
    if (req.session.userId) {
       return res.redirect('/homepage')
    }
    res.render('user/login', { msg: req.session.msg });
}




const homepage = (req, res) => {
    if (req.session.userId) {
       return res.render('user/home');
    } else {
        res.redirect('/login');
    }
}


const logout = (req, res) => {
    console.log('destroy');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};


const signup = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/homepage')
     }
    res.render('user/signup');
}


const signupdata = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password, confirmpassword } = req.body;

        const checkingUser = await signupcollection.findOne({ email });

        if (password !== confirmpassword) {
            console.log("Passwords do not match");
            return res.status(400).send("Passwords do not match");
        }

        if (checkingUser) {
            return res.send("User with the same email already exists");
        } else {

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create a new document and save it to the database
            const newUser = new signupcollection({
                username,
                email,
                password: hashedPassword,
            });

            await newUser.save();
        }
    }

    catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Error during user registration');
    }

    res.redirect('/login');
}


//login validation
const loginpost = async (req, res) => {
    const { lusername, lpassword } = req.body;
    const user = await signupcollection.findOne({ username: lusername });
 
    try {
        console.log('loginpost:', user);


        if (!user && !passwordMatch) {
            return res.render('user/login', { msg: 'Invalid username && Password' });
        }


        // Compare the provided plain-text password with the stored hashed password
        const passwordMatch = await bcrypt.compare(lpassword, user.password);

        if (!passwordMatch) {
            return res.render('user/login', { msg: 'Invalid Password' });
        }



        // create session
        req.session.userId = user;
        req.session.username = user.username;

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Error during login');
    }
    if (user.blocked) {
        console.log(user.blocked);
        return res.render('user/login', { msg: 'user blocked' });
    }
    res.redirect('/homepage');

}






module.exports = {
    login,
    signup,
    signupdata,
    loginpost,
    logout,
    homepage,
    popup
};
