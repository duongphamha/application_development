const express = require('express');
const userController = require('../controllers/user');
const multer = require('multer');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/uploads/product');
    },
    //add back the extension
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
})

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3
    },
})

router.get('/register', userController.register);
router.post('/sign-up', upload.single('image'), userController.signUp);
router.get('/login', userController.login);
router.post('/sign-in', userController.signIn);
router.get('/logout', userController.logout);
router.get('/profile', userController.profile);
router.post('/profile/update', upload.single('image'), isLoggedIn, userController.updateProfile);

module.exports = router;