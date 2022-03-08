$(function() {
    $("#addUser").validate({
        errorClass: 'text-danger',
        rules: {
            fullname: {
                required: true,
            },
            email: {
                required: true,
            },
            phone: {
                required: true,
            },
            password: {
                required: true,
                minlength: 8,
            },
            password2: {
                required: true,
                minlength: 8,
                equalTo: "#password",
            },
            address: {
                required: true,
            },
        },
    });

    $("#editUser").validate({
        errorClass: 'text-danger',
        rules: {
            fullname: {
                required: true,
            },
            email: {
                required: true,
            },
            phone: {
                required: true,
            },
            password: {
                required: false,
                minlength: 8,
            },
            password2: {
                required: false,
                minlength: 8,
                equalTo: "#password",
            },
            address: {
                required: true,
            },
        },
    });

    $("#login").validate({
        errorClass: 'text-danger',
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true,
                minlength: 8,
            },
        },
    });
});