/*
    Author : Asad Shahabuddin
    File   : service.js
    Details: REST Service for application - 'Console'.
    Email  : asad808@ccs.neu.edu
*/

app.factory("GlobalService", function GlobalService($http)
{
    var user = null;
    var errMsg = null;
    var nytAPIKey = "6b50b9dd8f1647a9456befedcda60f26:6:71641947";
    var books = null;
    var music = null;
    var personId = null;

    /* Register a new account */
    var register = function(user, callback)
    {
        $http.post("/api/register", user)
        .success(callback);
    };

    /* Verify login status */
    var isLoggedIn = function(callback)
    {
        $http.get("/api/loggedin")
        .success(callback);
    };

    /* Sign in */
    var login = function(user, callback)
    {
        $http.post("/api/login", user)
        .success(callback);
    };

    /* Sign out */
    var logout = function(callback)
    {
        clear();
        $http.post("/api/logout")
        .success(callback);
    };

    /* Clear objects */
    var clear = function()
    {
        user = null;
        errMsg = null;
        books = null;
        music = null;
    };

    /* Set current user */
    var setUser = function(u)
    {
        user = u;
    };

    /* Get the current user */
    var getUser = function()
    {
        return user;
    };

    /* Set error message */
    var setErrMsg = function(errMsg)
    {
        this.errMsg = errMsg;
    };

    /* Get error message */
    var getErrMsg = function()
    {
        return errMsg;
    };

    /* Set cover picture */
    var setCover = function(cover, callback)
    {
        if(user)
        {
            $http.put("/api/user/" + user._id + "/cover/" + cover)
            .success(callback);
        }
    };

    /* Get cover picture */
    var getCover = function(callback)
    {
        if(user)
        {
            $http.get("/api/user/" + user._id + "/cover")
            .success(callback);
        }
    };

    /* Set books */
    var setBooks = function(b)
    {
        books = b;
    };

    /* Get books */
    var getBooks = function()
    {
        return books;
    };

    /* Set music */
    var setMusic = function(m)
    {
        music = m;
    };

    /* Get music */
    var getMusic = function()
    {
        return music;
    };

    /* Set a specific person's ID */
    var setPersonId = function(pid)
    {
        personId = pid;
    };

    /* Get a specific person's ID */
    var getPersonId = function()
    {
        return personId;
    };

    /* Set favorite books */
    var setFavBooks = function(book, callback)
    {
        $http.put("/api/user/" + user._id + "/book/" + book.industryIdentifiers[0].identifier)
        .success(callback);
    };

    /* Get favorite books */
    var getFavBooks = function(uid, callback)
    {
        $http.get("/api/user/" + uid + "/books")
        .success(callback);
    };

    /* Get all users */
    var getPeople = function(callback)
    {
        $http.get("/api/people")
        .success(callback);
    };

    /* Get a user by ID */
    var getPerson = function(q, callback)
    {
        $http.get("/api/people/" + q).
        success(callback);
    };

    /* Get a user's details */
    var getPersonInfo = function(callback)
    {
        $http.get("/api/user/" + personId)
        .success(callback);
    };

    /* Get favorite music */
    var getFavMusic = function(uid, callback)
    {
        $http.get("/api/user/" + uid + "/music")
        .success(callback);
    };

    /* Get favorite books */
    var remFavBook = function(book, callback)
    {
        $http.delete("/api/user/" + user._id + "/book/" + book.industryIdentifiers[0].identifier)
        .success(callback);
    };

    /* Remove favorite music */
    var remFavMusic = function(url, callback)
    {
        $http.delete("/api/user/" + user._id + "/music/" + url)
        .success(callback);
    };

    /* Search news using The New York Times Top Stories API */
    var searchNews = function(callback)
    {
        $http.get("http://api.nytimes.com/svc/topstories/v1/home.json?api-key=" + nytAPIKey)
        .success(callback);
    };

    /* Search weather information using the Weather API */
    var searchWeather = function(q, callback)
    {
        $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + q)
        .success(callback);
    };

    /* Search books by title */
    var searchBooksByTitle = function(q, callback)
    {
        $http.get("https://www.googleapis.com/books/v1/volumes?q=" + q)
        .success(callback);
    };

    /* Search a book by ISBN */
    var searchBookByISBN = function(q, callback)
    {
        $http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + q)
        .success(callback);
    };

    /* Log user activities */
    var trace = function(msg, callback)
    {
        if(user)
        {
            $http.put("/api/user/" + user._id + "/trace/" + msg)
            .success(callback);
        }
    };
    
    /* Fetch trace */
    var feed = function(callback)
    {
        if(user)
        {
            $http.get("/api/user/" + user._id + "/trace")
            .success(callback);
        }
    };

    return {
        register          : register,
        isLoggedIn        : isLoggedIn,
        login             : login,
        logout            : logout,
        setUser           : setUser,
        getUser           : getUser,
        setErrMsg         : setErrMsg,
        getErrMsg         : getErrMsg,
        setCover          : setCover,
        getCover          : getCover,
        setBooks          : setBooks,
        getBooks          : getBooks,
        setMusic          : setMusic,
        getMusic          : getMusic,
        setPersonId       : setPersonId,
        getPersonId       : getPersonId,
        setFavBooks       : setFavBooks,
        getFavBooks       : getFavBooks,
        getPeople         : getPeople,
        getPerson         : getPerson,
        getPersonInfo     : getPersonInfo,
        getFavMusic       : getFavMusic,
        remFavBook        : remFavBook,
        remFavMusic       : remFavMusic,
        searchNews        : searchNews,
        searchWeather     : searchWeather,
        searchBooksByTitle: searchBooksByTitle,
        searchBookByISBN  : searchBookByISBN,
        trace             : trace,
        feed              : feed
    };
});
/* End of service.js */