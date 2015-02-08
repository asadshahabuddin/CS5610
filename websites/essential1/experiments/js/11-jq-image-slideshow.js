/*
    Author: Asad Shahabuddin
    File: 11-jq-image-slideshow.js
    Details: JS for '11-jq-image-slideshow.html'.
*/

$(".imgBox").click(function()
{
    var imgSrc = this.src;
    if(imgSrc.indexOf("darwin1") > -1)
    {
        this.src = this.src.replace("darwin1", "darwin2");
    }
    else if(imgSrc.indexOf("darwin2") > -1)
    {
        this.src = this.src.replace("darwin2", "earth");
    }
    else if(imgSrc.indexOf("earth") > -1)
    {
        this.src = this.src.replace("earth", "autumn");
    }
    else if(imgSrc.indexOf("autumn") > -1)
    {
        this.src = this.src.replace("autumn", "darwin1");
    }
});
/* End of 11-jq-image-slideshow.js */