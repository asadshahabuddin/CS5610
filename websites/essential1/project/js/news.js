/*
    Author : Asad Shahabuddin
    File   : news.js
    Details: JS for 'news.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("NewsCtrl", function($rootScope, $scope, $http, $location)
{
    console.log("%c   [echo] News Controller has been initialized",
                "font-family: Courier New;");

    $scope.headlines = [];

    /* Log user activities */
    $scope.trace = function(msg)
    {
        $http.put("/api/user/" + $rootScope.currentUser._id + "/trace/" + msg)
        .success(function(res)
        {
            // TODO
        });
    };

    /* Fetch headlines using The New York Times Top Stories API */
    $http.get("http://api.nytimes.com/svc/topstories/v1/home.json?api-key=6b50b9dd8f1647a9456befedcda60f26:6:71641947")
    .success(function(res)
    {
        console.log("%cHeadlines>",
                    "font-family: Courier New; font-weight: bold;");
        console.log(res);
        $scope.headlines = res.results;
        $scope.trace("Navigated to news");
    });

    /* Execute a Find and Replace on the 'abstract' field */
    $scope.abstract = function(headline)
    {
        return headline.abstract.replace("&#8217;", "'");
    };

    /* Fetch approximate weather information using the Weather API */
    $scope.weather = function(city)
    {
        if(city)
        {
            console.log("%c   [echo] Querying weather parameters for city '" + city + "'...",
                        "font-family: Courier New;");

            $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city)
            .success(function(res)
            {
                console.log("%cWeather>",
                            "font-family: Courier New; font-weight: bold;");
                console.log(res);

                $scope.city        = res.name;
                $scope.dt          = new Date();
                $scope.time        = $scope.dt.getHours() + ":" +
                                     $scope.dt.getMinutes();
                $scope.weatherMain = res.weather[0].main;
                $scope.temp        = res.main.temp - 273.15;
                $scope.humidity    = res.main.humidity;
                $scope.pressure    = res.main.pressure;
                $scope.windSpeed   = res.wind.speed;
            });

            $scope.trace("Queried weather conditions for " + city);
        }
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

    /*
    By default, weather card shows information for the city
    corresponding to the user currently signed in.
    */
    if($rootScope
       && typeof $rootScope.currentUser != "undefined"
       && typeof $rootScope.currentUser.city != "undefined")
    {
        $scope.weather($rootScope.currentUser.city);
    }
});
/* End of news.js */