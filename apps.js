document.addEventListener('DOMContentLoaded', () => {
    const bookListSection = document.getElementById('book-list');
    const bookFormSection = document.getElementById('book-form');
    const loginFormSection = document.getElementById('login-form');
    const borrowedBooksSection = document.getElementById('borrowed-books');
    const homeLink = document.getElementById('home');
    const addBookLink = document.getElementById('addBook');
    const borrowedBooksLink = document.getElementById('borrowedBooks');
    const loginLink = document.getElementById('login');
    const logoutLink = document.getElementById('logout');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Define books
    const initialBooks = [
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            isbn: "978-0061120084",
            pubDate: "July 11, 1960",
            category: "Fiction",
            synopsis: "A classic novel of modern American literature, this story explores themes of racial injustice and moral growth in the American South during the 1930s."
        },
        {
            title: "1984",
            author: "George Orwell",
            isbn: "978-0451524935",
            pubDate: "June 8, 1949",
            category: "Fiction",
            synopsis: "A dystopian social science fiction novel and cautionary tale about the future of society, depicting a totalitarian regime that uses surveillance, propaganda, and fear to control its citizens."
        },
        {
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            isbn: "978-0062316097",
            pubDate: "February 10, 2015",
            category: "Non-Fiction",
            synopsis: "This book explores the history of our species, from the emergence of Homo sapiens in the Stone Age up to the political and technological revolutions of the modern era."
        },
        {
            title: "Educated",
            author: "Tara Westover",
            isbn: "978-0399590504",
            pubDate: "February 20, 2018",
            category: "Non-Fiction",
            synopsis: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University."
        },
        {
            title: "A Brief History of Time",
            author: "Stephen Hawking",
            isbn: "978-0553380163",
            pubDate: "September 1, 1998",
            category: "Science",
            synopsis: "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as the nature of time and the universe."
        },
        {
            title: "The Selfish Gene",
            author: "Richard Dawkins",
            isbn: "978-0199291151",
            pubDate: "February 13, 1976",
            category: "Science",
            synopsis: "In this book, Dawkins presents an account of evolution from the perspective of the gene, exploring how genes propagate themselves in the gene pool and their role in natural selection."
        },
        {
            title: "Guns, Germs, and Steel: The Fates of Human Societies",
            author: "Jared Diamond",
            isbn: "978-0393317558",
            pubDate: "April 1, 1999",
            category: "History",
            synopsis: "This Pulitzer Prize-winning book examines the factors that have influenced the fate of human societies, focusing on the impact of geography and environment."
        },
        {
            title: "The Rise and Fall of the Third Reich: A History of Nazi Germany",
            author: "William L. Shirer",
            isbn: "978-1451651683",
            pubDate: "October 11, 1960",
            category: "History",
            synopsis: "A comprehensive historical account of Nazi Germany, this book provides an in-depth analysis of the rise of Adolf Hitler, the fall of the Third Reich, and the events of World War II."
        }
    ];

    let books = JSON.parse(localStorage.getItem('books')) || [];
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    let isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated')) || false;

    // Add initial books to library
    books = [...initialBooks, ...books];
    localStorage.setItem('books', JSON.stringify(books));

    const renderBooks = (booksToRender = books) => {
        bookListSection.innerHTML = '<h2>Books</h2>';
        if (booksToRender.length === 0) {
            bookListSection.innerHTML += '<p>No books available</p>';
            return;
        }
        booksToRender.forEach((book, index) => {
            bookListSection.innerHTML += `
                <div class="book">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <p>Publication Date: ${book.pubDate}</p>
                    <p>Category: ${book.category}</p>
                    <button onclick="editBook(${index})">Edit</button>
                    <button onclick="deleteBook(${index})">Delete</button>
                    <button onclick="borrowBook(${index})">Borrow</button>
                </div>
            `;
        });
    };

    const saveBook = (book) => {
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    };

    const updateBook = (index, updatedBook) => {
        books[index] = updatedBook;
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    };

    window.editBook = (index) => {
        const book = books[index];
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
        document.getElementById('pubDate').value = book.pubDate;
        document.getElementById('category').value = book.category;
        bookFormSection.classList.remove('hidden');
        document.getElementById('bookForm').onsubmit = (e) => {
            e.preventDefault();
            const updatedBook = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                isbn: document.getElementById('isbn').value,
                pubDate: document.getElementById('pubDate').value,
                category: document.getElementById('category').value
            };
            updateBook(index, updatedBook);
            bookFormSection.classList.add('hidden');
        };
    };

    window.deleteBook = (index) => {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    };

    window.borrowBook = (index) => {
        const book = books[index];
        const borrower = prompt('Enter your name:');
        const borrowDate = new Date().toLocaleDateString();
        const borrowedBook = { ...book, borrower, borrowDate, returnDate: null };
        borrowedBooks.push(borrowedBook);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        renderBorrowedBooks();
    };

    const renderBorrowedBooks = () => {
        const borrowedList = document.getElementById('borrowedList');
        borrowedList.innerHTML = '';
        if (borrowedBooks.length === 0) {
            borrowedList.innerHTML = '<p>No books borrowed</p>';
            return;
        }
        borrowedBooks.forEach((book, index) => {
            borrowedList.innerHTML += `
                <li>
                    ${book.title} by ${book.author} borrowed by ${book.borrower} on ${book.borrowDate}
                    <button onclick="returnBook(${index})">Return</button>
                </li>
            `;
        });
    };

    window.returnBook = (index) => {
        borrowedBooks[index].returnDate = new Date().toLocaleDateString();
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        renderBorrowedBooks();
    };

    document.getElementById('bookForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const book = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            pubDate: document.getElementById('pubDate').value,
            category: document.getElementById('category').value
        };
        saveBook(book);
        bookFormSection.classList.add('hidden');
    });

    homeLink.addEventListener('click', () => {
        bookListSection.classList.remove('hidden');
        bookFormSection.classList.add('hidden');
        loginFormSection.classList.add('hidden');
        borrowedBooksSection.classList.add('hidden');
    });

    addBookLink.addEventListener('click', () => {
        bookFormSection.classList.remove('hidden');
        bookListSection.classList.add('hidden');
        loginFormSection.classList.add('hidden');
        borrowedBooksSection.classList.add('hidden');
    });

    borrowedBooksLink.addEventListener('click', () => {
        borrowedBooksSection.classList.remove('hidden');
        bookListSection.classList.add('hidden');
        bookFormSection.classList.add('hidden');
        loginFormSection.classList.add('hidden');
        renderBorrowedBooks();
    });

    loginLink.addEventListener('click', () => {
        loginFormSection.classList.remove('hidden');
        bookListSection.classList.add('hidden');
        bookFormSection.classList.add('hidden');
        borrowedBooksSection.classList.add('hidden');
    });

    logoutLink.addEventListener('click', () => {
        isAuthenticated = false;
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        logoutLink.classList.add('hidden');
        loginLink.classList.remove('hidden');
        alert('Logged out successfully');
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication logic (replace with real authentication)
        if (username === 'admin' && password === 'admin') {
            alert('Login successful');
            isAuthenticated = true;
            localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
            logoutLink.classList.remove('hidden');
            loginLink.classList.add('hidden');
            loginFormSection.classList.add('hidden');
            bookListSection.classList.remove('hidden');
        } else {
            alert('Invalid credentials');
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.isbn.toLowerCase().includes(query)
        );
        renderBooks(filteredBooks);
    });

    renderBooks();
    if (isAuthenticated) {
        logoutLink.classList.remove('hidden');
        loginLink.classList.add('hidden');
    }
});


