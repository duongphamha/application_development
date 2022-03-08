$(function() {
    $("#addProduct").validate({
        errorClass: 'text-danger',
        rules: {
            name: {
                required: true,
            },
            price: {
                required: true,
            },
            quantity: {
                required: true,
            },
            image: {},
            description: {
                required: true,
            },
        },
    });

    $("#editProduct").validate({
        errorClass: 'text-danger',
        rules: {
            name: {
                required: true,
            },
            price: {
                required: true,
            },
            quantity: {
                required: true,
            },
            image: {},
            description: {
                required: true,
            },
        },
    });
});