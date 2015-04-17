/*
    Author : Asad Shahabuddin
    File   : welcome.js
    Details: JS for 'welcome.html'.
    Email  : asad808@ccs.neu.edu
*/

/* Verify login status */
var checkLogin = function($q, $timeout, $location, GlobalService)
{
    var deferred = $q.defer();

    GlobalService.isLoggedIn(function(res)
    {
        if(res != '0')  /* User is authenticated */
        {
            GlobalService.setUser(res);
            deferred.resolve();
        }
        else            /* User isn't authenticated */
        {
            GlobalService.setErrMsg("You need to sign in");
            deferred.reject();
            $location.url("/");
        }
        if(res)
        {
            console.log("%cCurrent user>",
                        "font-family: Courier New; font-weight: bold");
            console.log(res);
        }
        if(GlobalService.getErrMsg())
        {
            console.log("%c  [error] " + GlobalService.getErrMsg(),
                        "color: red; font-family: Courier New;");
        }
    });

    return deferred.promise;
};

app.controller("LoginCtrl", function($scope, $location, $anchorScroll, GlobalService)
{
    console.log("%c   [echo] Login Controller has been initialized",
                "font-family: Courier New;");

    /* Navigate to 'Sign In' section */
    $scope.gotoSignIn = function()
    {
        $location.hash("signin");
        $anchorScroll();
    };

    /* Login as a guest user */
    $scope.guest = function()
    {
        $location.url("/profileg");
    };

    /* Register a new account */
    $scope.register = function(user)
    {
        if(user
           && typeof user.username != "undefined"
           && typeof user.password != "undefined"
           && user.password == user.password2)
        {
            console.log("%c   [echo] Attempting to register user '" +
                        user.username + "'",
                        "font-family: Courier New;");

            user["cover"] = "image/cover1.jpg";
            GlobalService.register(user, function(res)
            {
                console.log("%cSuccess.",
                            "color: green; font-family: Courier New;");
                GlobalService.setUser(res);
                $scope.login(user);
            });
        }
        else
        {
            console.log("%c  [error] Invalid/incomplete information has been entered",
                        "color: red; font-family: Courier New;");
            if(user.password != user.password2)
            {
                console.log("%c  [error] Passwords don't match",
                            "color: red; font-family: Courier New;");
                $scope.notif       = 0;  /* 0 (zero) represents false */
                $scope.passwdmatch = 0;  /* 0 (zero) represents false */
            }
            console.log("%c   [echo] Try again",
                        "font-family: Courier New;");
        }
    };

    /* Sign in */
    $scope.login = function(user)
    {
        console.log("%c   [echo] Attempting to sign in user '" +
                    user.username + "'",
                    "font-family: Courier New;");

        GlobalService.login(user, function(res)    /* Success callback */
        {
            console.log("%c>Response.",
                        "font-family: Courier New;");
            console.log(res);
            console.log("%cSuccess.",
                        "color: green; font-family: Courier New;");
            console.log("%cCurrent user>",
                        "font-family: Courier New; font-weight: bold");
            console.log(res);
            GlobalService.setUser(res);
            $location.url("/profile");
        }, function()                              /* Failure callback */
        {
            $scope.notif       = 1;  /* 1 represents true */
            $scope.passwdmatch = 1;  /* 1 represents true */
        });
    };

    /* Sign out */
    var logout = function()
    {
        if(GlobalService.getUser())
        {
            GlobalService.logout(function()
            {
                console.log("%c   [echo] Logged out successfully",
                            "font-family: Courier New;");   
         
            });
        }
        $location.url("/");
    };

    /* Log user activities */
    var trace = function(msg)
    {
        GlobalService.trace(msg, function(res){});
    };
});
/* End of welcome.js */