<%@ Page Language="C#" %>

<script runat="server">
    <%-- This demo page has no server side script --%>
</script>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset='utf-8' />
        <title>Asad Shahabuddin | Home</title>

        <!-- Style sheets -->
        <link rel="stylesheet" type="text/css" href="css/default.css"/>
    </head>

    <body class="asBody">
        <ul class="asNav">
            <li><a href="sitestatistics/" target="_blank">SiteStatistics</a></li>
            <li><a href="statistics/" target="_blank">Statistics</a></li>
            <li><a href="source/" target="_blank">Source</a></li>
            <li><a href="search/" target="_blank">Search</a></li>
            <li><a href="searchtree/" target="_blank">SearchTree</a></li>
            <li><a href="textview/" target="_blank">TextView</a></li>
            <li><a href="filelist.aspx" target="_blank">FileList</a></li>
            <li><a href="autofile.aspx" target="_blank">AutoFile</a></li>
            <li><a href="images/autoimage.aspx" target="_blank">Images</a></li>
            <li><a href="blog/" target="_blank">Blog</a></li>
            <li><a href="story/index.htm?../experiments/" target="_blank"><span class="asBoldSpan">Experiments</span></a></li>
            <li><a href="https://github.com/asadshahabuddin/CS5610" target="_blank">GitHub</a></li>
        </ul>
        
        <div class="pad">
            <form id="form1" runat="server">
                <div class="asContentDiv">
                    <h2>About</h2>
                    <img class="asThumbnail" src="images/asad1.jpeg" title="Asad Shahabuddin"/>
                    <p>
                        Bonjour. My name is <span class="asBoldSpan">Asad</span> and I am currently enrolled in a full-time 
                        graduate course in the Master of Science program in Computer Science at Northeastern University, Boston.
                    </p>
                    <p>
                        I have worked on a number of projects during my academic and professional career. The most recent 
                        project I embarked on involved research work on an alternative Facebook news feed which aims to be 
                        more intuitive and predictable by grouping stories from individuals in a carousel-based interface 
                        using Twitter's Bootstrap framework. In addition to the academic experience, I have about 2 and half 
                        years of professional experience in the field of software design, development and maintenance including 
                        my Co-op at IBM in 2014 and full-time at Cognizant Technology Solutions.
                    </p>
                    <p>
                        I have a broad spectrum of interests which include writing, reading literary classics, watching movies 
                        and football matches, programming, listening to various genres of music and casual photography.
                    </p>

                    <hr class="asHr"/>

                    <h2>Academics</h2>
                    <table class="asTable">
                        <tbody>
                            <tr>
                                <td>M.S. in Computer Science</td>
                                <td><a class="asA" href="http://www.northeastern.edu/">Northeastern University</a></td>
                                <td class="right">2013 - 2015</td>
                            </tr>
                            <tr>
                                <td>B.Tech. in Information Technology</td>
                                <td><a class="asA" href="http://www.wbutech.net/">West Bengal University of Technology</a></td>
                                <td class="right">2007 - 2011</td>
                            </tr>
                        </tbody>
                    </table>

                    <br/>

                    <h3>CS 5610</h3>
                    <ul class="asImgList">
                        <li>
                            <a href="story/index.htm?../experiments/">
                                <img src="images/experiment5.png" class="asImgLink"/>
                                <span class="asImgHoverSpan"><span>Experiments</span></span>
                            </a>
                        </li>
                    </ul>

                    <br/>

                    <div class="asCenterElem">
                        <span class="contact-item">
                            <a class="asA" href="https://www.facebook.com/leosfacemash" target="_blank" title="Facebook">
                                <img class="asContactImg" src="images/facebook.png"/>
                            </a>
                        </span>
                        <span class="contact-item">
                            <a class="asA" href="https://twitter.com/asad_olorin" target="_blank" title="Twitter">
                                <img class="asContactImg" src="images/twitter.png"/>
                            </a>
                        </span>
                        <span class="contact-item">
                            <a class="asA" href="https://www.linkedin.com/in/asadshahabuddin" target="_blank" title="LinkedIn">
                                <img class="asContactImg" src="images/linkedin.png"/>
                            </a>
                        </span>
                        <span class="contact-item">
                            <a class="asA" href="https://github.com/asadshahabuddin/" target="_blank" title="GitHub">
                                <img class="asContactImg" src="images/github.png"/>
                            </a>
                        </span>
                        <span class="contact-item">
                            <a class="asA" href="http://of-evermore.blogspot.com/" target="_blank" title="Blogger">
                                <img class="asContactImg" src="images/blogger.png"/>
                            </a>
                        </span>
                    </div>

                    <footer class="asCenterElem">
                        <details>
                            <summary class="asBlancSpan">&copy; Copyright 2015 Northeastern University</summary>
                            <span class="asCenterElem asBlancSpan">
                                by <span class="asBoldSpan">Asad Shahabuddin</span>
                                <br />
                                All Rights Reserved.
                            </span>
                        </details>
                    </footer>
                </div>
            </form>
        </div>
    </body>
</html>
<!-- End of Default.aspx -->