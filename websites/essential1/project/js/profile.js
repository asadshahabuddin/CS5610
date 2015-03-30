/*
    Author : Asad Shahabuddin
    File   : profile.js
    Details: JS for 'profile.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("ProfileCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] Profile Controller has been initialized",
                "font-family: Courier New;");

    /* Sign out */
    $scope.logout = function()
    {
        if(GlobalService.getUser())
        {
            GlobalService.logout(function()
            {
                console.log("%c   [echo] Logged out user '" + GlobalService.getUser().username + "'",
                            "font-family: Courier New;");
            });
        }
        $location.url("/");
    };

    /* Log user activities */
    $scope.trace = function(msg)
    {
        GlobalService.trace(msg, function(res)
        {
            $scope.feed();
        });
    };

    /* Fetch trace */
    $scope.feed = function()
    {
        GlobalService.feed(function(res)
        {
            if(res != null)
            {
                $scope.activities = res.activity;
            }
        });
    };

    /* Display modal window */
    $scope.coverModal = function()
    {
        document.getElementById("as-cover-modal").showModal();
    };

    /* Set cover picture */
    $scope.changeCover = function(cover)
    {
        document.getElementById("as-cover-div").style.backgroundImage = "url(" + cover + ")";
        cover = cover.replace("image/", "image-");
        cover = cover.replace(".", "-");
        GlobalService.setCover(cover, function(res)
        {
            $scope.trace("Changed your cover picture");
        });
    };

    /* Get cover picture */
    $scope.cover = function()
    {
        GlobalService.getCover(function(res)
        {
            document.getElementById("as-cover-div").style.backgroundImage = "url(" + res + ")";
        });
    }

    /* Initialize profile page */
    $scope.u = GlobalService.getUser();
    $scope.cover();
    $scope.feed();
});
/* End of profile.js */