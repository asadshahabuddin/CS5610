/*
    Author : Asad Shahabuddin
    File   : people.js
    Details: JS for 'people.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("PeopleCtrl", function($scope, $location, GlobalService)
{
    console.log("%c   [echo] People Controller has been initialized",
                "font-family: Courier New;");

    /* Sign out */
    $scope.logout = function()
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
    $scope.trace = function(msg)
    {
        GlobalService.trace(msg, function(res){});
    };

    /* Search for people by keyword */
    $scope.search = function(q)
    {
        if(!q)
        {
            GlobalService.getPeople(function(res)
            {
                $scope.people = res;
            });
        }
        else
        {
            GlobalService.getPerson(q, function(res)
            {
                $scope.people = res;
            });
        }
    };

    /* Visit a person */
    $scope.gotoPerson = function(person)
    {
        GlobalService.setPersonId(person._id);
        $location.url("/person");
    };

    $scope.u = GlobalService.getUser();
    $scope.search();
});
/* End of people.js */