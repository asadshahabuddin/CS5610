/*
    Author: Asad Shahabuddin
    File: mail.js
    Details: JavaScript for 'mail.html'.
    Email ID: asad808@ccs.neu.edu
*/

var app = angular.module("Node2Application", []);
console.log("%c>Email",
            "color: navy; font-family: Courier New; font-weight: bold");

app.controller("Node2Controller", function($scope, $http)
{
	console.log("%c [echo] Email Controller has been initialized",
                "font-family: Courier New;");

	$scope.sendMail = function(email)
	{
		$http.post("/api/mail", email)
		.success(function(response)
		{
			console.log("%cEmail Details>",
                		"font-family: Courier New;");
			console.log(response);
		})
	}
});
/* End of mail.js */