const Admincollection = require('../model/adminschema');
const usercollection = require('../model/loginschema');
const bcrypt = require('bcrypt');


const  updateuser = async (req, res) => {
    const userId = req.params.userId;
    const { username, email } = req.body;

    try {
        const updatedUser = await usercollection.findByIdAndUpdate(userId, { username, email }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.redirect('/adminusers');
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

const useredit = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await usercollection.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('admin/useredit', { user })
    }

    catch (error) {
        console.error('Error rendering edit user form:', error);
        res.status(500).send('Internal Server Error');
    }
}

const admin = (req, res) => {
    console.log('here');
    if (req.session.isAdminLoggedIn) {
        res.render('admin/adminpage')
    } else {
        res.redirect('/adminlogin')
    }
}

const adminloginpage = (req, res) => {
    if (req.session.isAdminLoggedIn) {
        res.redirect('/admin')
    }
    res.render('admin/adminlogin')
}



const adminlogout = (req, res) => {
    console.log('destroy');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/adminlogin');
    });
};

const adminusers = async (req, res) => {
    if (req.session.isAdminLoggedIn) {
        try {
            const users = await usercollection.find();
            return res.render('admin/admincontrol', { users });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).send('Error fetching users');
        }
    } else {
        res.redirect('/admin')
    }
};

const adminlogin = async (req, res) => {
    try {
        const { ausername, apassword } = req.body;

        const foundAdmin = await Admincollection.findOne({ username: ausername });
        console.log(foundAdmin);
        if (!foundAdmin) {
            console.log(`Admin not found for username: ${ausername}`);
            return res.status(401).send('Invalid username or password');
        }
        if (!foundAdmin.password) {
            return res.status(401).send('Invalid password');
        }

        req.session.isAdminLoggedIn = true;
        req.session.adminUsername = ausername;

        res.redirect('/admin')

    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).send('Error during login');
    }
}

// user block
const userblock = async (req, res) => {

    const userId = req.params.userId;

    try {
        const user = await usercollection.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }


        user.blocked = true;
        await user.save();
        return res.redirect('/adminusers');

    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// user unblock
const userunblock = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const user = await usercollection.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }


        user.blocked = false;
        await user.save();
        return res.redirect('/adminusers');

    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send('Internal Server Error');
    }
}

//user delete
const userdelete = async (req, res) => {
    console.log('userdelete');
    const userId = req.params.userId

    try {
        // find the user with userid and delete from database
        const deletedUser = await usercollection.findByIdAndRemove(userId);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/adminusers');

    }

    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
}

//user search
const usersearch = async (req, res) => {
    const { searchQuery } = req.query;
    console.log(searchQuery);

    try {
        if (!searchQuery) {
            res.redirect('/adminusers'); // Redirect back to the admin page or display a message
            return;
        }
        const users = await usercollection.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive username search
                { email: { $regex: searchQuery, $options: 'i' } } // Case-insensitive email search
            ]
        });
        res.render('admin/admincontrol', { users });

    }

    catch (error) {
        console.error('Error searching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

const createuser = async (req, res) => {
    const { cusername, cemail, cpassword } = req.body
    try {

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(cpassword, saltRounds);

        const newUser = new usercollection({ username: cusername, email: cemail, password: hashedPassword });
        await newUser.save();

        res.redirect('/adminusers')
    }

    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}






module.exports = {
    admin,
    adminloginpage,
    adminlogin,
    adminlogout,
    adminusers,
    userblock,
    userunblock,
    useredit,
    userdelete,
    usersearch,
    updateuser,
    createuser
}