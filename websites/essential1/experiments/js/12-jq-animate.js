/*
    Author: Asad Shahabuddin
    File: 12-jq-animate.js
    Details: JS for '12-jq-animate.html'.
*/

$(".animateBtn").click(function()
{
    var div = $(".contentBox");
    
    div.animate({width: "300px"}, "slow");
    div.animate({height: "300px"}, "slow");
    div.animate({opacity: "0.5"}, "slow");
    div.animate({fontSize: "5em"}, "slow");
    div.animate({height: "100px"}, "slow");
    div.animate({width: "200px"}, "slow");

    div.text("Gray");
});
/* End of 12-jq-animate.js */