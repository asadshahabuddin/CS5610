/*
    Author: Asad Shahabuddin
    File: 32-weather.js
    Details: JavaScript file for '32-weather.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("WeatherApplication", []);

console.log("%c>Weather",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("WeatherController", function($scope, $http)
{
    console.log("%c   [echo] Weather Controller has been initialized",
                "font-family: Courier New;");

    $scope.query = function()
    {
        if(!$scope.cityName)
        {
            console.log("%c[warning] City not provided",
                        "font-family: Courier New;")
            return;
        }

        /* Output to console */
        console.log("%c   [echo] Querying weather parameters for city '" + $scope.cityName + "'...",
                    "font-family: Courier New;");

        $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + $scope.cityName)
        .success(function(response)
        {
            console.log(response);

            $scope.name        = response.name;
            $scope.dt          = new Date();
            $scope.time        = $scope.dt.getHours() + ":" +
                                 $scope.dt.getMinutes();
            $scope.weatherMain = response.weather[0].main;
            $scope.temp        = response.main.temp - 273.15;
            $scope.humidity    = response.main.humidity;
            $scope.pressure    = response.main.pressure;
            $scope.windSpeed   = response.wind.speed;
         });
    }
});
/* End of 32-weather.js */