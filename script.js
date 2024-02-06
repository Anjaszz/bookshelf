(() => {
  
    let books = [];

   
    function addBook(event) {
        event.preventDefault();

        
        const titleInput = document.querySelector("#inputBookTitle");
        const authorInput = document.querySelector("#inputBookAuthor");
        const yearInput = document.querySelector("#inputBookYear");
        const isCompleteInput = document.querySelector("#inputBookIsComplete");

       
        const yearValue = parseInt(yearInput.value, 10);

       
        if (isNaN(yearValue)) {
            alert("Tahun harus berupa angka");
            return; 
        }

       
        const newBook = {
            id: +new Date,
            title: titleInput.value,
            author: authorInput.value,
            year: yearValue, 
            isComplete: isCompleteInput.checked
        };

        
        console.log(newBook);

        
        books.push(newBook);

        
        document.dispatchEvent(new Event("bookChanged"));
    }

   
    function searchBooks(event) {
        event.preventDefault();

       
        const searchInput = document.querySelector("#searchBookTitle");
        const query = searchInput.value;

        
        query ? displayBooks(books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()))) : displayBooks(books);
    }

   
    function markAsComplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], isComplete: true };
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    
    function markAsIncomplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], isComplete: false };
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    
    function removeBook(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    
    function displayBooks(filteredBooks) {
        const incompleteBookshelf = document.querySelector("#incompleteBookshelfList");
        const completeBookshelf = document.querySelector("#completeBookshelfList");

        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        for (const book of filteredBooks) {
            const bookElement = document.createElement("article");
            bookElement.classList.add("book_item");

            const titleElement = document.createElement("h2");
            titleElement.innerText = book.title;

            const authorElement = document.createElement("p");
            authorElement.innerText = "Penulis: " + book.author;

            const yearElement = document.createElement("p");
            yearElement.innerText = "Tahun: " + book.year;

            bookElement.appendChild(titleElement);
            bookElement.appendChild(authorElement);
            bookElement.appendChild(yearElement);

            if (book.isComplete) {
                const actionDiv = document.createElement("div");
                actionDiv.classList.add("action");

                const incompleteButton = createButton(book.id, "Belum Selesai dibaca", "green", markAsIncomplete);
                const deleteButton = createButton(book.id, "Hapus buku", "red", removeBook);

                actionDiv.appendChild(incompleteButton);
                actionDiv.appendChild(deleteButton);

                bookElement.appendChild(actionDiv);
                completeBookshelf.appendChild(bookElement);
            } else {
                const actionDiv = document.createElement("div");
                actionDiv.classList.add("action");

                const completeButton = createButton(book.id, "Selesai dibaca", "green", markAsComplete);
                const deleteButton = createButton(book.id, "Hapus buku", "red", removeBook);

                actionDiv.appendChild(completeButton);
                actionDiv.appendChild(deleteButton);

                bookElement.appendChild(actionDiv);
                incompleteBookshelf.appendChild(bookElement);
            }
        }
    }

    
    function createButton(id, text, colorClass, clickHandler) {
        const button = document.createElement("button");
        button.id = id;
        button.innerText = text;
        button.classList.add(colorClass);
        button.addEventListener("click", clickHandler);
        return button;
    }

    
    function saveAndDisplayBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks(books);
    }

    
    window.addEventListener("load", () => {
       
        books = JSON.parse(localStorage.getItem("books")) || [];

       
        displayBooks(books);

        const addBookForm = document.querySelector("#inputBook");
        const searchBookForm = document.querySelector("#searchBook");
        
        addBookForm.addEventListener("submit", addBook);
        searchBookForm.addEventListener("submit", searchBooks);
        document.addEventListener("bookChanged", saveAndDisplayBooks);
    });
})();
