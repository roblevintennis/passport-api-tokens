$('document').ready(function() {

    window.Store = {
        user: null,
        setUser: function(user) {
            this.user = user;
        },
        getUser: function() {
            return this.user;
        },
        getToken: function() {
            return this.user ? this.getUser().token : null;
        },
        removeUser: function() {
            delete this.user;
        }
    };

    /////////////////////////////////////////////////////////////////
    // AUTH TOKEN ///////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('#login').on("click", function(e) {
        var email = $('.email').val();
        var password = $('.password').val();
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "/token/",
            data: {email:email, password:password},
            success: function(data){
                Store.setUser({email: email, token: data.token});
                console.log("Finished setting user: " + email + ", Token: " + data.token);
                alert("You're now logged in. Try clicking the 'Test Token' button next.");
            },
            error: function(data) {
                alert(data.statusText);
            }
        });
    });

    /////////////////////////////////////////////////////////////////
    // AUTH TOKEN ///////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('#resetPassword').on("click", function(e) {
        var $form = $(this).closest('form');
        var email = $form.find("input[name='email']").val();
        var currPass = $form.find("input[name='current_password']").val();
        var newPass = $form.find("input[name='new_password']").val();
        var confirmPass = $form.find("input[name='confirm_new_password']").val();
        if (email) {
            $.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                url: '/reset/password',
                data: {email:email, current_password:currPass, new_password: newPass, confirm_new_password: confirmPass},
                success: function() {
                    alert("Password updated ... Now go to http://localhost:1337/login to log in with new password.");
                },
                error: function(data) {
                    alert(data.statusText);
                }
            });
        }
    });

    /////////////////////////////////////////////////////////////////
    // LOGOUT ///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('.logout').on("click", function(e) {

        var token = Store.getToken();
        Store.removeUser();
        if (token) {
            $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: "/logout",
                headers: {
                    token: token
                },
                success: function(data) {
                    console.log(data);
                    if (data.error) {
                        alert("Issue logging out.");
                    } else {
                        alert("You're now logged out.");
                    }
                }
            });
        } else {
            alert("No token");
        }
    });

    /////////////////////////////////////////////////////////////////
    // SIMULATE API REQUEST /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('.testToken').on("click", function(e) {
        var token = Store.getToken();
        if (token) {
            $.ajax({
                type: "GET",
                cache: false,
                dataType: "json",
                url: "/apitest/",
                headers: {
                    token: token
                },
                success: function(data) {
                    if (data.error) {
                        alert("Error: " + data.error);
                    } else {
                        console.log(data.user);
                        alert("Token callback worked! Check console");
                    }
                }
            });
        } else {
            alert("No token");
        }
    });

});
