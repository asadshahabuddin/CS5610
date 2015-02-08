/*
    Author: Asad Shahabuddin
    File: 13-jq-unfold.js
    Details: JS for '13-jq-unfold.html'.
*/
$(document).ready(function()
{
    $(".flipBox").click(function()
    {
        $(this).hide();
        $(".contentBox").slideDown(5000);
    });
});
/* End of 13-jq-unfold.js */