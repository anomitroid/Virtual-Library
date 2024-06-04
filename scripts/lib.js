let myLibrary = {} // library class
let bookNum = "1"
let closeButtons = document.querySelectorAll (".close") // close button
let userResults = document.getElementById ("user-results") // div in which all cards will be added
const newBookForm = document.getElementById ("new-book") // form which inputs details of new book. present in add-book-modal
const addCard = document.getElementById ("add-card") // contains every book card
const formTitle = document.getElementById ("title") // book title for form

// book object class
class Book {
    constructor (id, name, author, isbn, read, imgsrc) { // parameterised constructor for class
        this.id = id
        this.name = name
        this.author = author
        this.read = read
        this.isbn = isbn
        this.dateAdded = new Date ()
        this.imgsrc = imgsrc
    }
    print () { // printing book details for debugging
        console.log (this.name, this.author, this.read)
    }
    changeStatus () { // use this to change the status of read not-read for a book
        this.read = true
    }
}

// utility function to add a new object to myLibrary
function newBookObject (name, author, isbn, read, imgsrc) {
    myLibrary.unshift (new Book (bookNum, name, author, isbn, read, imgsrc)) // create new object using parametrerised constructor
    bookNum = (parseInt (bookNum) + 1).toString () // convert bookNum to int, add 1 and convert back to string
}

// utility function to add a card in the user-results div
function newCard (book) {
    let newCard = document.createElement ('div')
    newCard.classList = "user-card"
    newCard.innerHTML = `<img src = "${book.imgsrc}" class = "avatar">`

    let newContent = document.createElement ('div')
    // book's name, author, isbn in a single div
    newContent.classList = "card-content"
    newContent.innerHTML = 
    `
    <div class = "close">
        <button>&times;</button>
    </div>
    <div class = "top-info">${book.name}</div>
    <div class = "bottom-info">${book.author}</div>
    <div class = "isbn">ISBN: ${book.isbn}</div>
    <br><br>
    ` // contains the contents to be displayed when hovered on a book card
    
    // book's read/not-read status in another div
    let hasReadToggle = document.createElement ('div')
    hasReadToggle.classList = "has-read"
    hasReadToggle.dataset.bookid = book.id
    if (book.read) {
        hasReadToggle.innerHTML = 
        `
        <div>Read</div>
        <label class = "checkbox-btn">
            <label for = "checkbox"></label>
            <input id = "checkbox" type = "checkbox" checked>
            <span class = "checkmark"></span>
        </label>
        `
    }
    else {
        hasReadToggle.innerHTML = 
        `
        <div>Not Read</div>
        <label class = "checkbox-btn">
            <label for = "checkbox"></label>
            <input id = "checkbox" type = "checkbox">
            <span class = "checkmark"></span>
        </label>
        `
    } 
    // slider subject to switch and 'Read'/'Not Read' has to be changed accordingly
    // this is achieved through changeReadStatus function
    hasReadToggle.addEventListener ('change', changeReadStatus) // function defined later

    newContent.appendChild (hasReadToggle) // add read/not-read div in main card content div
    newCard.appendChild (newContent) // add main card content to card div
    userResults.appendChild (newCard) // add card to div containing all cards
    newCard.id = book.id // id of card div will match the unique id of book i.e. bookNum
    const closeButton = newContent.querySelectorAll (".close")[0] // since querySelectorAll returns a list of all .close divs, select the first (only) element from list
    closeButton.addEventListener ('click', deleteCard) // deleteCard function defined later
}

// utility function to toggle switch and change 'Read to Not Read' and vice verse
const changeReadStatus = function (e) {
    // this function searches through every book in myLibrary and matches the book-id with the id
    // of the element which triggered the event
    // if no such book found, it returns false
    // if book found, it's read status is changed and updated
    myLibrary.some (book => {
        if (book.id == e.target.dataset.bookid) {
            if (book.read) {
                book.read = false
                e.target.parentNode.parentNode.firstChild.textContent = "Not Read"
                /* e.target returns the element that triggered the event 
                which in this case is the slider checkbox
                parentNode of this checkbox is <label class = "switch"></label>
                parentNode of the label is the has-read div
                and firstNode of that div is the read/not-read text div*/
                saveUserLibrary () // used to update myLibrary in localStorage
            }
            else {
                book.read = true
                e.target.parentNode.parentNode.firstChild.textContent = "Read"
                saveUserLibrary ()
            }
        }
        return book.id == e.target.dataset.bookid
    })
}

let card = false // this is used as a flag to check if any card is selected
// i.e. to check if the close button is of a book card or + card

// utility function to close / delete a card when the .close button is clicked
const deleteCard = function (e) {
    if (!card) { // if card is false, no card is selected (i.e. + card's close button has been triggered)
        card = e.target.parentNode.parentNode.parentNode // select the card whose close button has been clicked
        // e.target returns the element which triggers the event
        // which in this case is close button
        // parentNode of this button gives .close div
        // parentNode of .close div gives card-content div
        // parentNode of card-content div gives user-card div
        toggleBookModal (deleteModal) // switch to delete modal
    }
    else { // if a book card is selected then we need to remove the card from myLibrary
        for (let i = 0; i < myLibrary.length; i ++) {
            if (myLibrary[i].id == card.id) myLibrary.splice (i, 1) // delete card from myLibrary
        }
        saveUserLibrary () // update myLibrary
        card.parentNode.removeChild (card) // remove the card's div from user-results div
        card = false // deselect the card
    }
}

// utility function called when the page is reopened after clearing data
function pageReset () {
    localStorage.clear ()
    bookNum = "1"
}

// utility function which converts the library object containing book objects 
// into cards in the user-results div
function loadLibrary (library) {
    const keys = Object.keys (library) // returns list of objects in library
    keys.forEach (book => {
        newCard (library [book]) // makes a card out of each object
    })
}

// utility function to remove all children of a parent div / element
function removeChildren (parent) {
    while (parent.firstChild) parent.removeChild (parent.firstChild)
}

getUserLibrary () // to be used anytime the window loads

// if api doesn't load correctly, null values may be added
// this utility function removes those null values
function cleanLibrary (library) {
    for (let i = 0; i < library.length; i ++) {
        if (!library[i]) library.splice (i, 1); // remove any null values
    }
}

// runs whenever window loads
if (!localStorage.getItem ("myLibrary")) {
    loadLibrary (defaultLibrary) // add defaultLibrary to localStorage
    myLibrary = defaultLibrary // initially, myLibrary is defaultLibrary
    saveUserLibrary ()
}
else {
    cleanLibrary (myLibrary)
    loadLibrary (myLibrary)
} 

// saveUserLibrary, getUserLibrary defined in local.js
// toggleBookModal defined in modals.js