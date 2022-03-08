const express = require('express');
const productController = require('../controllers/product');
const multer = require('multer');
const { isAdmin } = require('../middleware/auth');

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

router.get('/admin/product/list', isAdmin, productController.showAllProducts);
router.get('/admin/product/add', isAdmin, productController.addProduct);
router.post('/admin/add-product', upload.single('image'), isAdmin, productController.storeProduct);
router.get('/admin/product/edit', isAdmin, productController.editProduct);
router.post('/admin/edit-product', upload.single('image'), isAdmin, productController.updateProduct);
router.get('/admin/delete-product', isAdmin, productController.deleteProduct);
router.get('/admin/product/search', isAdmin, productController.searchProduct);

module.exports = router;