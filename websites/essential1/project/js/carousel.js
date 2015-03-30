/*
    Author : Asad Shahabuddin
    File   : carousel.js
    Details: Carousel controls.
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
/* End of carousel.js */