/*
    Author : Asad Shahabuddin
    File   : profile.js
    Details: JS for 'profile.html'.
    Email  : asad808@ccs.neu.edu
*/

app.controller("ProfileCtrl", function($scope, $http)
{
    console.log("%c   [echo] Profile Controller has been initialized",
                "font-family: Courier New;");

    $scope.headlines = [];

    /* Fetch headlines using The New York Times Top Stories API */
    $http.get("http://api.nytimes.com/svc/topstories/v1/home.json?api-key=6b50b9dd8f1647a9456befedcda60f26:6:71641947")
    .success(function(res)
    {
        console.log("");
        console.log("%cHeadlines>",
                    "font-family: Courier New; font-weight: bold;");
        console.log(res);
        $scope.headlines = res.results;
    });

    /* Execute a Find and Replace on the 'abstract' field */
    $scope.abstract = function(headline)
    {
        return headline.abstract.replace("&#8217;", "'");
    }

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
                console.log("");
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
         }
    }
});
/* End of profile.js */