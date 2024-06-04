const sortDropdown = document.getElementById ("sort-select")
const searchBar = document.getElementById ("search-bar")
const readFilter = document.getElementById ("read-filter")

// whenever a sorting option is chosen from the dropdown, sort the user-results in chosen order
sortDropdown.addEventListener ('change', (e) => {
    console.log (e.target.value)
    if (e.target.value == "a-z") {
        cleanLibrary (myLibrary) // removes all null values
        azSort () // lexicographically smallest sorting
    }
    else if (e.target.value == "z-a") {
        cleanLibrary (myLibrary) // removes all null values
        zaSort () // lexicographically largest sorting
    }
    else if (e.target.value == "newest") {
        cleanLibrary (myLibrary) // removes all null values
        newSort () // time of addition latest first
    }
    else if (e.target.value == "oldest") {
        cleanLibrary (myLibrary) // removes all null values
        oldSort () // time of addition latest last
    }
    removeChildren (userResults) // clear the user-results div which contains the cards completely
    createAddCard () // add the + card
    loadLibrary (myLibrary) // load the sorted library (defined in lib.js) 
})

// utility function to add the + card after the user results div has been cleared
function createAddCard () {
    let newAddCard = document.createElement ("div")
    newAddCard.classList = "user-card add-card"
    newAddCard.id = "add-card"
    newAddCard.innerHTML = `<div class = "plus">+</div>`
    newAddCard.addEventListener ('click', () => {toggleBookModal (addBookModal)})
    userResults.appendChild (newAddCard)
}

// utility function for lexicographically smallest sorting
const azSort = function () {
    myLibrary.sort ((a, b) => {
        return (a.name > b.name) ? 1 : -1 // sort on the basis of name
    })
    saveUserLibrary () // update the library (defined in local.js)
    return myLibrary
}

// utility function for lexicographically largest sorting
const zaSort  = function () {
    myLibrary.sort ((a, b) => {
        return (a.name > b.name) ? -1 : 1 // sort on the basis of name
    })
    saveUserLibrary () // update the library (defined in local.js)
    return myLibrary 
}

// utility function for time of addition latest last
function oldSort () {
    myLibrary.sort ((a, b) => {
        return (a.dateAdded > b.dateAdded) ? 1 : -1
    })
    saveUserLibrary ()
}

// utility function for time of addition latest first
function newSort () {
    myLibrary.sort ((a, b) => {
        return (a.dateAdded > b.dateAdded) ? -1 : 1
    })
    saveUserLibrary ()
}

// utility function for filtering books by search parameters
searchBar.addEventListener ('input', (e) => { // as soon as input begins, this function executes
    const regex = new RegExp (`${searchBar.value}`, 'i')
    // create a regular expression to match with book name or book author.
    // "i" flag helps ignore differnces in case (i.e. uppercase and lowercase) 
    let searchResults = matches = myLibrary.filter (book => { // iterate through myLibrary to find matches 
        return book.name.match (regex) || book.author[0].match (regex) // display book if the name of the book or name of the author is matched
    }) // only the matched book objects to the new library
    removeChildren (userResults) // first, clear the div containing all cards
    createAddCard () // add the + card
    loadLibrary (searchResults) // load the new library
})

// utility function for filtering books based on read / not-read
readFilter.addEventListener ('change', (e) => { // as soon the radio button chosen is changed, this function is executed
    console.log (e.target.value) // log the value of the radio button which triggered the function
    let tempLibrary = [] // create an empty library object to store the filtered books
    const value = e.target.value
    if (value == "read") { // check the button clicked
        myLibrary.forEach (book => {
            if (book.read) tempLibrary.push (book) // add every book with corresponding .read bool value
        })
        removeChildren (userResults) // clear all cards
        createAddCard () // add + card
        loadLibrary (tempLibrary) // show filtered library
    }
    if (value == "not-read") {
        myLibrary.forEach (book => {
            if (!book.read) tempLibrary.push (book)
        })
        removeChildren (userResults)
        createAddCard ()
        loadLibrary (tempLibrary)
    }
    if (value == "all") {
        removeChildren (userResults)
        createAddCard ()
        loadLibrary (myLibrary) // load the library with all unfiltered books
    }
})