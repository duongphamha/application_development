const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
    res.render('store/register');
}

exports.signUp = async(req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            fullname: req.body.fullname,
            role: req.body.role,
            address: req.body.address,
            image: req.file.filename,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.redirect('/login');
    }
};

exports.login = (req, res) => {
    res.render('store/login');
}

exports.signIn = async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        await req.flash('msg_error', 'Incorrect email or password.');
        return res.redirect('/login');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {

        await req.flash('msg_error', 'Incorrect email or password.');
        return res.redirect('/login');
    }
    req.session.user = user;
    if (user.role == 0) {
        return res.redirect('/admin/product/list');
    } else if (user.role == 1) {
        return res.redirect('/home');
    }
};

exports.logout = async(req, res) => {
    req.session.destroy();
    res.redirect('/home');
}

exports.profile = async(req, res) => {
    res.render('store/profile', { user: req.session.user });
}

exports.updateProfile = async(req, res) => {
    let user = await User.findById(req.body.id);
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.phone = req.body.phone;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }
    if (req.file) {
        user.image = req.file.filename;
    }
    user.address = req.body.address;
    try {
        user = await user.save();
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        res.redirect('/profile');
    }
}