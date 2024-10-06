// Initialize Firebase Firestore and Authentication
const db = firebase.firestore();
const auth = firebase.auth();

// Handle seller login
function login() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert('Logged in as ' + userCredential.user.email);
            window.location.href = "sell.html";  // Redirect to sell page
        })
        .catch(error => {
            alert(error.message);
        });
}

// Seller form submission (store in Firestore)
if (document.getElementById('bookForm')) {
    document.getElementById('bookForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const price = document.getElementById('price').value;
        const contact = document.getElementById('contact').value;
        const description = document.getElementById('description').value;
        const imageInput = document.getElementById('bookImage');
        const reader = new FileReader();

        reader.readAsDataURL(imageInput.files[0]);
        reader.onload = function() {
            const imageURL = reader.result;

            db.collection("books").add({
                title: title,
                author: author,
                price: price,
                contact: contact,
                description: description,
                imageURL: imageURL
            })
            .then(() => {
                alert("Book listed successfully!");
                document.getElementById('bookForm').reset();
            })
            .catch(error => {
                alert("Error adding book: " + error.message);
            });
        };
    });
}

// Display books on Buy Books page from Firestore
if (document.getElementById('bookList')) {
    function displayBooks() {
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';

        db.collection("books").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const book = doc.data();

                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');
                
                bookItem.innerHTML = `
                    <img src="${book.imageURL}" alt="Book Image">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Price:</strong> ${book.price}</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                    <a href="https://wa.me/${book.contact}" target="_blank">Contact Seller</a>
                `;

                bookList.appendChild(bookItem);
            });
        });
    }

    displayBooks();  // Call to display books on page load
}
