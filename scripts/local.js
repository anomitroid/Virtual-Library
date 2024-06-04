// checks if memory is available in localStorage or sessionStorage of the browser
function storageAvailable (type) {
    var storage;
    try {
        storage = window[type]; // storage is either localStorage or sessionStorage
        var x = '__storage_test__'; // test value
        storage.setItem (x, x); // try adding a key value pair to the storage
        storage.removeItem (x); // remove the pair from the storage after testing
        return true; // if the above steps are done without errors return true or go to catch block
    }
    catch (e) { // check for the type of error first
        return e instanceof DOMException && ( // check if the error is DOMException
            // every browser except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // if code is not present, check for field name
            // every browser except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // QuotaExceededError is only valid when there is something already stored
            (storage && storage.length !== 0);
    }
}

// check if storage is available in localStorage
if (storageAvailable ('localStorage')) console.log ("lessgoooo")
else console.log ("suorer bachha gnaar mereche")

// utility function to add retrieve myLibrary from localStorage before using it as an object
function getUserLibrary () {
    if (localStorage.getItem ("myLibrary")) {
        myLibrary = JSON.parse (localStorage.getItem ("myLibrary"))
    }
    if (localStorage.getItem ("bookNum")) {
        bookNum = localStorage.getItem ("booknum")
    }
}

// utility function that saves the updates made in myLibrary in localStorage
function saveUserLibrary () {
    localStorage.setItem ("myLibrary", JSON.stringify (myLibrary))
    localStorage.setItem ("bookNum", bookNum)
}

// whenever any object is stored in localStorage, it is stored as a string
// so in order to use it in our js file, we need to convert it into
// a JSON i.e. a JavaScript Object Notation.
// when storing it in storage again, we first need to convert it into a string
// we thus need to do this with myLibrary object
// but since bookNum is a string by itselt, it doesn't need to be converted to 
// JSON or strin before storing it


// this default library will get loaded into localStorage whenever page loads for the first time
const defaultLibrary = [
    {
        id: "book1",
        name: "The Iliad and The Odyssey",
        author: ["Homer"],
        read: true,
        isbn: "9780140445923",
        imgsrc: "./images/iliad.jpg",
        dateAdded: new Date ()
    },
    {
        id: "book2",
        name: "Pride and Prejudice",
        author: ["Jane Austen"],
        read: true,
        isbn: "9780141439518",
        imgsrc: "./images/janeausten.png",
        dateAdded: new Date ()
    },
    {
        id: "book3",
        name: "Metamorphosis",
        author: ["Franz Kafka"],
        read: true,
        isbn: "1557427666",
        imgsrc: "./images/kafka.jpg",
        dateAdded: new Date ()
    },
    {
        id: "book4",
        name: "Anna Karenina",
        author: ["Leo Tolstoy"],
        read: false,
        isbn: "9780140449174",
        imgsrc: "./images/annakarenina.jpeg",
        dateAdded: new Date ()
    },
    {
        id: "book5",
        name: "Gitanjali",
        author: ["Rabindranath Tagore"],
        read: true,
        isbn: "9789382616344",
        imgsrc: "./images/gitanjali.jpg",
        dateAdded: new Date ()
    },
    {
        id: "book6",
        name: "Little Women",
        author: ["Louisa May Alcott"],
        read: true,
        isbn: "9789382616345",
        imgsrc: "./images/lilwomen.jpg",
        dateAdded: new Date()
    }
];