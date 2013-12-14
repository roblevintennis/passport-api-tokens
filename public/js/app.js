$('document').ready(function() {

    //Hack: Flash info/errors
    var message = $('.flash');
    if (message.length) {
        setTimeout( function() {
            message.fadeOut('slow');
        }, 3000);
    }

    window.Store = {
        user: null,
        setUser: function(user) {
            this.user = user;
        },
        getUser: function() {
            return this.user;
        },
        getToken: function() {
            return this.getUser().token;
        }
    };

    /////////////////////////////////////////////////////////////////
    // AUTH TOKEN ///////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('button[type="submit"]').on("click", function(e) {
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
                $('.flash.success').text("You're now logged in. Try clicking the 'Test Token' button next.").show().fadeOut(3000);
            }
        });
    });

    /////////////////////////////////////////////////////////////////
    // SIMULATE API REQUEST /////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    $('.testToken').on("click", function(e) {
        var token = Store.getToken();
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
                $('.flash.success').text("Token callback worked! Check console").show().fadeOut(3000);
            }
        });
    });

});
