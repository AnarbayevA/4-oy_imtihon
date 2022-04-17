// Get HTML element

let elForm = document.querySelector(".header__form");
let elSearchInput = document.querySelector("#search_input");


let elResultsNumber = document.querySelector(".hero__result-number");
let elOrderByNews = document.querySelector(".hero__btn");

let elBookmarkWrapper = document.querySelector(".bookmark__inner");
let elBookmarkTemplate = document.querySelector("#bookmark-template").content;

let elBooksMarketTemplateWrapper = document.querySelector(".books-market__top");
let elBooksMarketTemplate = document.querySelector("#books-market-template").content;

let elModalWrapper = document.querySelector(".modal-header");
let elMoreInformationTemplate = document.querySelector("#more-information-template").content;

// get data from server
elForm.addEventListener("submit", function(evt){
    evt.preventDefault();

    let inputString = elSearchInput.value.trim()

    ;(async function(){
        let information = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${inputString}`);
        
        let data = await information.json();
        let info = data.items
    
        console.log(info);
        
        renderBooks(info, elBooksMarketTemplateWrapper)
        
    })();

    elSearchInput.value = null
})

// render books
function renderBooks(array, wrapper){
    
    wrapper.innerHTML = null

    let bookFragment = document.createDocumentFragment()

    array.forEach(item => {
        let elBooksMarketTemplate2 = elBooksMarketTemplate.cloneNode(true);

        elBooksMarketTemplate2.querySelector(".books-market__book-image").src = item.volumeInfo.imageLinks.smallThumbnail;
        elBooksMarketTemplate2.querySelector(".books-market__book-name").textContent = item.volumeInfo.title;
        elBooksMarketTemplate2.querySelector(".books-market__book-year").textContent= item.volumeInfo.publishedDate.slice(0,4);
        elBooksMarketTemplate2.querySelector(".books-market__book-outhor").src = item.volumeInfo.authors.join(",");
        elBooksMarketTemplate2.querySelector(".bookmark-btn").dataset.moreInfoBtnId = item.id;
        elBooksMarketTemplate2.querySelector(".more-info-btn").dataset.bookmarkBtnId = item.id;
        elBooksMarketTemplate2.querySelector(".read-btn").href = item.volumeInfo.previewLink;

        bookFragment.appendChild(elBooksMarketTemplate2)
    });

    wrapper.appendChild(bookFragment)

    let renderResults = array.length

    if(renderResults === 0){
        elResultsNumber.textContent = "No any books"
    }

    else(
        elResultsNumber.textContent = renderResults
    )

}

let bookmarkAdder = []

// bookMark
elBooksMarketTemplateWrapper.addEventListener("click", function(evt){
    let bookmarkGotId = evt.target.dataset.bookmarkBtnId

    if(bookmarkGotId){
        ;(async function(){
            let information = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookmarkGotId}`);
            
            let data = await information.json();
            let info = data.items
            bookmarkAdder.push(info)
        
            
            renderBookmarkInfo(bookmarkAdder, elBooksMarketTemplateWrapper)
            
        })();
    }
})

function renderBookmarkInfo(array, wrapper) {
    wrapper.innerHTML = null

    let elFragment = document.createDocumentFragment()
    array.forEach(item => {
        let bookMarkDiv = elBookmarkTemplate.cloneNode(true)

        bookMarkDiv.querySelector(".bookmark__book-name").textContent = item.title;
        bookMarkDiv.querySelector(".bookmark__outhor-name").textContent = item.authors;
        bookMarkDiv.querySelector(".bookmark__book-href").href = item.previewLink;
        bookMarkDiv.querySelector(".bookmark__delete-btn").dataset.bookmarkDeleteBtnId = item.id;

        elFragment.appendChild(bookMarkDiv)
    });

    wrapper.appendChild(elFragment)
}

let bookStorage = window.localStorage;

let getItemFromLocalStorage = JSON.parse(bookStorage.getItem("bookArray"));
let bookmarkBooks = getItemFromLocalStorage || [];

if(getItemFromLocalStorage){
    bookmarkBooks = getItemFromLocalStorage
}
else{
    bookmarkBooks = []
}

elBookmarkWrapper.addEventListener("click", function(evt){
    let bookID = evt.target.dataset.moreInfoBtnId;

    if (bookID) {
        
        let foundBook = normolizeMovies.find(item => item.id == bookID)

        let checkInclude = bookmarkBooks.findIndex(item =>   item.id === foundBook.id
        )

        if (checkInclude === -1) {
            bookmarkBooks.push(foundBook)
            storage.setItem("movieArray", JSON.stringify(bookmarkBooks))
            renderBookmars(bookmarkBooks, elBookmark)
        }
        
    }
   
})


