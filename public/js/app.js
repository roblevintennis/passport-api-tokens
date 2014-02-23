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
                    console.log(data.user);
                    alert("Token callback worked! Check console");
                }
            });
        } else {
            alert("No token");
        }
    });

});
