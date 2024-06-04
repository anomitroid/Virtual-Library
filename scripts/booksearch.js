// utility function which returns the book object data from google books api

/*
the object returned by this api is an array if 10 elements
each element is a book object
each of these book objects contain several attributes associated with them
e.g. accessInfo, saleInfo, searchInfo, selfLink etc
There are only a few of these attributes with which we concern ourselves
the majority of these important attributes is found in an Object called volumeInfo
the important attributes inside volumeInfo are:
1. authors
2. imageLinks
3. industryIdentifiers (for the isbn numbers)
other useful data we could have used are:
1. categories (genre)
2. description
3. language
4. page count
5. maturity rating 
out of these 10 book objects returned, the first object is the book that appears on the 'is this the book you're looking for?' modal
when the used asks for the list of alternative books, the entire list of 10 book objects is displayed
*/
const bookSearch = async function (searchText) { // pass the text typed by user as the input
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchText}` // put it in url and wait for search results to return
    const response = await fetch (url) // this function is not called until the url is fetched 
    if (!response.ok) throw Error (response.status) // if no book is found, return from fetch is NULL, in that case return Error
    const data = await response.json () // if a book is successfully found, convert it to a json object
    resultados = data // assign the search result object of 10 books to a global variable
    return data // return the object
}