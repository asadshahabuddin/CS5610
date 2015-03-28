/*
    Author : Asad Shahabuddin
    File   : profile.js
    Details: JS for 'profile.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("ProfileCtrl", function($rootScope, $scope, $http, $location)
{
    console.log("%c   [echo] Profile Controller has been initialized",
                "font-family: Courier New;");

    /* Log user activities */
    $scope.trace = function(msg)
    {
        $http.put("/api/user/" + $rootScope.currentUser._id + "/trace/" + msg)
        .success(function(res)
        {
            $scope.feed();
        });
    };

    /* Fetch trace */
    $scope.feed = function()
    {
        $http.get("/api/user/" + $rootScope.currentUser._id + "/trace")
        .success(function(res)
        {
            if(res != null)
            {
                $scope.activities = res.activity;
            }
        });
    };

    /* Sign out */
    $scope.logout = function()
    {
        if($rootScope
           && typeof $rootScope.currentUser != "undefined")
        {
            $http.post("/api/logout")
            .success(function()
            {
                console.log("%c   [echo] Logged out user '" + $rootScope.currentUser.username + "'",
                            "font-family: Courier New;");
            });
        }
        $location.url("/");
    };

    /* Display modal window */
    $scope.coverModal = function()
    {
        document.getElementById("as-cover-modal").showModal();
    };

    /* Set cover picture */
    $scope.cover = function()
    {
        $http.get("/api/user/" + $rootScope.currentUser._id + "/cover")
        .success(function(res)
        {
            document.getElementById("as-cover-div").style.backgroundImage = "url(" + res + ")";
        });
    }

    /* Change cover picture */
    $scope.changeCover = function(file)
    {
        document.getElementById("as-cover-div").style.backgroundImage = "url(" + file + ")";
        file = file.replace("image/", "image-");
        file = file.replace(".", "-");
        $http.put("/api/user/" + $rootScope.currentUser._id + "/cover/" + file)
        .success(function(res)
        {
            $scope.trace("Changed your cover picture");
        });
    };

    /* Initialize profile page */
    $scope.cover();
    $scope.feed();
});
/* End of profile.js */