const header = document.querySelector("header");
const logoMenu = header.lastElementChild;
const menu = document.querySelector(".menu__Lista");

logoMenu.addEventListener("click", () => {
    menu.classList.toggle("show");
    console.log("click");
});

const createBookCard = (book) => {
    const card = document.createElement("section");
    card.classList.add("book-card");
    card.dataset.bookId = book.id;

    const bookInfo = book.volumeInfo;

    const image = document.createElement("img");
    image.classList.add("book-image");
    image.src = bookInfo.imageLinks?.thumbnail || "img/placeholder.png";
    image.alt = bookInfo.title || "Sin título";

    const infoSection = document.createElement("section");
    infoSection.classList.add("book-info");

    const bookName = document.createElement("h2");
    bookName.classList.add("book-name");
    bookName.textContent = bookInfo.title || "Sin título";

    const author = document.createElement("p");
    author.classList.add("book-author");
    const hasAuthors = Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0;
    author.textContent = `Autor(es): ${hasAuthors ? bookInfo.authors.join(", ") : "Desconocido"}`;

    const publishedDate = document.createElement("p");
    publishedDate.classList.add("book-publishedDate");
    publishedDate.textContent = `Publicado: ${bookInfo.publishedDate || "Desconocido"}`;

    const description = document.createElement("div");
    description.classList.add("book-summary");
    description.innerHTML = bookInfo.description || "<em>Sin descripción disponible.</em>";

    infoSection.appendChild(bookName);
    infoSection.appendChild(author);
    infoSection.appendChild(publishedDate);
    infoSection.appendChild(description);

    card.appendChild(image);
    card.appendChild(infoSection);

    
    card.addEventListener("click", () => {
        card.classList.toggle("active");
    });

    return card;
};

const loadBooks = async (query = "subject:fiction") => {
    const bookGrid = document.getElementById("book");
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`);
        const books = response.data.items;

        bookGrid.innerHTML = "";

        for (const book of books) {
            if (!book.volumeInfo) continue;

            const bookCard = createBookCard(book);
            bookGrid.appendChild(bookCard);
        }
    } catch (error) {
        console.error("Error cargando libros:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();

    const button = document.getElementById("search-button");
    const input = document.getElementById("book-search");

    button.addEventListener("click", () => {
        const value = input.value.trim();
        if (value) loadBooks(value);
    });
});
