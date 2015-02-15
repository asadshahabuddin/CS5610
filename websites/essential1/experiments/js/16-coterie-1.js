/*
    Author: Asad Shahabuddin
    File: 16-coterie-1.js
    Details: JS for 'Coterie'.
*/

var app = angular.module("coterie-app", []);
app.controller("coterie-controller",
function($scope)
{
    /* Output to console */
    console.log("%cCOTERIE application has initialized.",
                "color: navy; font-family: Courier New; font-weight: bold");
    
    /* Objects definitions */
    var items =
    [
        {
            title: "Pride and Prejudice",
            authors: ["Jane Austen"],
            description: "When Elizabeth Bennet meets handsome bachelor Fitzwilliam Darcy, she immediately deems him proud--arrogant, conceited, and utterly obnoxious. When she later discovers that Darcy has deliberately turned another man against her beloved sister Jane, she resolves to have nothing more to do with him. In the comedy of manners that follows, Jane Austen portrays Elizabeth's prejudice toward a man who has resolved to be particularly careful to hide any sign of his admiration for her--with all of the consequent misunderstandings and entertaining reconciliations readers have come to expect from one of the finest British novelists. Newly designed and typeset in a modern 6-by-9-inch format by Waking Lion Press.",
            publishedDate: "2008-07",
            averageRating: "4.0"
        },
        {
            title: "The Idiot",
            authors: ["Fyodor Dostoyevsky"],
            description: "Returning to St. Petersburg from a Swiss sanatorium, the gentle and naive Prince Myshkin - known as 'the idiot' - pays a visit to his distant relative General Yepanchin and proceeds to charm the General, his wife and his three daughters. But his life is thrown into turmoil when he chances on a photograph of the beautiful Nastasya Filippovna. Utterly infatuated with her, he soon finds himself caught up in a love triangle and drawn into a web of blackmail, betrayal and, finally, murder. In Prince Myshkin, Dostoyevsky set out to portray the purity of 'a truly beautiful soul' and to explore the perils that innocence and goodness face in a corrupt world.",
            publishedDate: "1996-01-01",
            averageRating: "4.5"
        },
        {
            title: "The Catcher in the Rye",
            authors: ["J. D. Salinger"],
            description: "A 16-year old American boy relates in his own words the experiences he goes through at school and after, and reveals with unusual candour the workings of his own mind. What does a boy in his teens think and feel about his teachers, parents, friends and acquaintances?",
            publishedDate: "2013-09",
            averageRating: "3.5"
        },
    ];

    $scope.items = items;

    $scope.selectItem = function(item)
    {
        alert("'" + item.title + "' has been selected.");
    }

    $scope.addItem = function(item)
    {
        var authors = [item.author];
        var newItem =
        {
            title: item.title,
            authors: authors,
            description: item.description,
            publishedDate: item.publishedDate,
            averageRating: item.averageRating
        }

        items.push(newItem);
    }

    $scope.editItem = function(item)
    {
        $scope.item = item;
    }

    $scope.removeItem = function(item)
    {
        items.splice(items.indexOf(item), 1);
    }
});
/* End of 16-coterie-1.js */