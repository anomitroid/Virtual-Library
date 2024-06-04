const overlay = document.getElementById ("overlay")

/*this function adds the modals to the overlay div to make the modals float over the
background rather than erase it. the argument 'modal' is replaced with either addBookModal or any
other modal options.*/
// utility function for whenever we need to open or close a modal
function toggleBookModal (modal) {
    if (overlay.classList.contains ("active")) { // if some modal is active in the overlay section, close it
        let current = document.getElementById (overlay.dataset.target)
        current.classList.remove ("active")
        overlay.classList.remove ("active")
        overlay.dataset.target = ""
        card = false // card defined in lib.js. used to check if the card concerned is book card or + card
    }
    else { // if no modal is active, open the required modal
        modal.classList.add ("active")
        overlay.classList.add ("active")
        overlay.dataset.target = modal.id
    }
}

const addBookModal = document.getElementById ("add-book-modal")
const addBookButton = document.getElementById ("add-book-button")

const bookSearchModal = document.getElementById ("book-search-modal")
const bookSearchImg = document.getElementById ("booksearch-img")
const bookSearchTitle = document.getElementById ("booksearch-title")
const bookSearchAuthor = document.getElementById ("booksearch-author")
const bookSearchISBN = document.getElementById ("booksearch-isbn")

const bookListModal = document.getElementById ("book-list-modal")
const searchAgainButton = document.getElementById ("search-again")

const errorModal = document.getElementById ("error-modal")
const errorModalButton = document.getElementById ("error-return")

const deleteModal = document.getElementById ("delete-modal")


// some variables are to be defined which would have global access across all functions
let resultados // used to store the book api we obtained from the url
let currentTitle // used to store the title of the obtained book
let currentAuthor // used to store the author of the obtained book
let currentISBN // used to store the ISBN of the obtained book
let currentImgsrc // used to store the image src of the obtained book
let hasRead // used to store the read / not read boolean of the obtained book

// utility function for whenever the 'Get Book' button is clicked
addBookButton.addEventListener ('click', async (e) => { // async is used so that whenever we use 'await'
// the function waits for the occurence of that particular event to execute this function
    e.preventDefault () // prevents the Get Book button from actually submitting the form
    if (newBookForm.cbox1.checked) hasRead = true // if book is already read, then hasRead will be true
    else hasRead = false // else hasRead will be false
    // newBookForm was defined in lib.js and it contains the html element containing the form
    console.log ("check")
    let title = newBookForm.title.value // this contains the title entered by the user
    let author = newBookForm.author.value // this stores the author entered by the user
    let isbn = newBookForm.isbn.value // this stores the isbn entered by the user
    try {
        await populateSearchModal (title, author, isbn) // function defined later (used to get the best possible book from the api results)
        toggleBookModal () // close the form modal
        toggleBookModal (bookSearchModal) // open the "is this the book you're looking for?" modal
    }
    catch { // if no book was found
        toggleBookModal () // close the active modal
        toggleBookModal (errorModal) // show the error modal
    }
})

// result and resultados stores the return object from bookSearch api
// it contains 10 items. each item has an attribute called volumeInfo
// an arbitrary volumeInfo is an object which has 
/* the severql attributes. the ones we are concerned about are
1. imagelinks (which furthur has 2 categories: smallThumbnail and thumbnail)
2. title
3. authors
4. industryIdentifiers (contains the different isbn codes). 
*/


// utility function for generating the contents of the "Is this the book you're looking for?" modal
async function populateSearchModal (title, author, isbn) {
    results = await bookSearch (`${title} ${author} ${isbn}`)
    resultados = results
    bookSearchImg.innerHTML = `<img src = ${results.items[0].volumeInfo.imageLinks.thumbnail} alt = ""></img>`
    bookSearchTitle.innerHTML = results.items[0].volumeInfo.title
    bookSearchAuthor.innerHTML = results.items[0].volumeInfo.authors
    bookSearchISBN.innerHTML = `ISBN: ${results.items[0].volumeInfo.industryIdentifiers[0].identifier}`
    currentTitle = results.items[0].volumeInfo.title
    currentAuthor = resultados.items[0].volumeInfo.author
    currentISBN = resultados.items[0].volumeInfo.industryIdentifiers[0].identifier
    currentImgsrc = results.items[0].volumeInfo.imageLinks.thumbnail
}


// utility function for whenever the user confirms that this IS the book they are looking for
const confirmButton = document.getElementById ("confirm") // if the user clicks on the Yes button in confirm book modal
confirmButton.addEventListener ('click', (e) => {
    newBookObject (currentTitle, currentAuthor, currentISBN, hasRead, currentImgsrc) // create book object using data derived from api
    saveUserLibrary () // update the library
})

// utility function for whenever the user says that IS NOT the book they are looking for
const showAllResultsButton = document.getElementById ("show-all-results-button")
showAllResultsButton.addEventListener ('click', (e) => {
    e.preventDefault () // prevent the "Yes" button from generating the extra books list rightaway 
    toggleBookModal () // first close the active modal
    toggleBookModal (bookListModal) // open the book list modal
    populateResultsList () // generate the extra books list
})

// utility function for whenever a book is chosen from the list of alternative books provided
const bookResultsContainer = document.getElementById ("book-results-container") // the div which contains the list of alternative books
const listItemClick = function (e) {
    console.log ("hell yeah")
    console.log (e.target.dataset.target) 
    /*
    e.target returns the action which triggered the event, i.e. the book chosen from the list
    e.target.dataset returns the dataset associated with that book
    data-target attribute of the div which contasins that book is returened
    so, this line essentially returns the index of the chosen book in the list
    */
    let i
    try {
        i = e.target.dataset.target // if this index is obtainable
    }
    catch { // if index is not obtainable
        i = e.target.parentElement.dataset.target // return the index of parent element of the chosen book
    }
    // update all the global attribute variables
    let title = resultados.items[i].volumeInfo.title
    let author = resultados.items[i].volumeInfo.authors
    let isbn
    if (resultados.items[i].volumeInfo.industryIdentifiers) isbn = resultados.items[i].volumeInfo.industryIdentifiers[0].identifier
    bookSearchTitle.innerHTML = title
    bookSearchAuthor.innerHTML = author
    bookSearchISBN.innerHTML = `ISBN: ${isbn}`
    currentTitle = title
    currentAuthor = author
    currentISBN = isbn
    try { // if image could not be generated
        bookSearchImg.innerHTML = `<img src = ${resultados.items[i].volumeInfo.imageLinks.thumbnail} alt = ""></img>`
        currentImgsrc = resultados.items[i].volumeInfo.imageLinks.thumbnail
    }
    catch { // display no image available instead
        bookSearchImg.innerHTML = `No Image Available`
        currentImgsrc = false
    }
    toggleBookModal () // close the book list modal
    toggleBookModal (bookSearchModal) // open the 'is this book you're looking for?' modal
}

// utility function for creating the book list
function populateResultsList () {
    removeChildren (bookResultsContainer) // remove all existing divs inside the book list div
    let i = 0 // this keeps track of index of the books in the list
    resultados.items.forEach (result => { // iterate through all 10 books geenrated from api
        const newListItemContainer = document.createElement ("div")
        newListItemContainer.classList = "list-item-container"
        newListItemContainer.dataset.target = i
        if (result.volumeInfo.imageLinks) { // data-target of each book is set to the index of the book in the list. 
            // this index is used to check if a book is properly generated in listItemClick
            newListItemContainer.innerHTML = 
            `
            <div class = "list-item-title" data-target = ${i}>
                ${result.volumeInfo.title}
            </div>
            <div class = "list-item-author" data-target = ${i}>
                ${result.volumeInfo.authors}
            </div>
            <div class = "list-item-thumb">
                <img data-target = ${i} src = ${result.volumeInfo.imageLinks.smallThumbnail} alt = "">
            </div>
            `
        }
        else {
            newListItemContainer.innerHTML = 
            `
            <div class = "list-item-title" data-target = ${i}>
                ${result.volumeInfo.title}
            </div>
            <div class = "list-item-author" data-target = ${i}>
                ${result.volumeInfo.authors}
            </div>
            <div class = "list-item-thumb">
                No image available
            </div>
            `
        }
        newListItemContainer.addEventListener ('click', listItemClick) // call listItemClick when a book is chosen from the list
        bookResultsContainer.appendChild (newListItemContainer) // add each book to the div containing the list
        i ++ // increment index iterator
    })
}

// utility function for when the user wants to go back to type the book name from the search menu
searchAgainButton.addEventListener ('click', (e) => {
    e.preventDefault () // prevent from opening it straightaway
    toggleBookModal () // close the active book list modal
    toggleBookModal (addBookModal) // open the book form modal
})

// utility function for when a book cannot be found from the text typed by the user and the user wants to type something new
errorModalButton.addEventListener ('click', () => {
    toggleBookModal () // close the current active modal
    toggleBookModal (addBookModal) // open the book form modal 
})

// utility function which asks for confirmation from the user before deleting a book from the user-results div
const confirmDeleteButton = document.getElementById ("confirm-delete")
confirmDeleteButton.addEventListener ('click', (e) => {
    e.preventDefault ()
    deleteCard () // delete the card (defined in lib.js)
    toggleBookModal () // close the modal
})

// utility function for when the user wants to cancel the deletion of a book from the library
const cancelDeleteButton = document.getElementById ("cancel-delete")
cancelDeleteButton.addEventListener ('click', (e) => {
    e.preventDefault () 
    card = false // reset the card selected back to default i.e. + card
    toggleBookModal () // close the modal
})

// to be used when something else is clicked outside an active modal
overlay.addEventListener ('click', () => {
    if (overlay.classList.contains ("active")) { // if a modal is active
        toggleBookModal () // close the modal
        card = false // reset the card selected back to default i.e. + card
    }
})