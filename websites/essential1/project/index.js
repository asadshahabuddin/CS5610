/*
    Author : Asad Shahabuddin
    File   : index.js
    Details: JS for 'index.html'.
    Email  : asad808@ccs.neu.edu
*/

$(document).ready(function()
{ 
    $(".asCarouselDiv").owlCarousel(
    {
        autoPlay        : 3000,
        stopOnHover     : true,
        navigation      : false,
        paginationSpeed : 1000,
        goToFirstSpeed  : 2000,
        singleItem      : true,
        autoHeight      : true,
        transitionStyle :"fade"
    }); 
});
/* End of index.js */