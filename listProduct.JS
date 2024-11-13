
let products = null;

// Fetch products from JSON file
fetch('Product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    });

let listProductHTML = document.querySelector('.listProduct');

function addDataToHTML() {
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');

            let theProduct = document.createElement('a');
            theProduct.href = '/detail.html?id=' + product.id;

            theProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}</div>
                <p class="stock">Only ${product.number} left in stock</p>
            `;

            let addToCartButton = document.createElement('button');
            addToCartButton.classList.add('add-to-cart');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.setAttribute('data-id', product.id);

            addToCartButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                addToCart(product.id);
            });

            newProduct.appendChild(theProduct);
            newProduct.appendChild(addToCartButton);
            listProductHTML.appendChild(newProduct);
        });
    }
}

//Function to show sliding notification
let notificationTimeout; //Declare a global variable to store the timeout ID

function  showNotification(productName) {
    const notificationPanel = document.getElementById('notification-panel');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = `${productName} has been added to the cart`;
    notificationPanel.classList.add('show');

    //clear any exixting timeout to prevent overlap
    if(notificationTimeout) clearTimeout(notificationTimeout);

    //Hide the notification after 3 seconds
    notificationTimeout = setTimeout( () => {
        notificationPanel.classList.remove('show');
    }, 3000);
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(product.name)
    updateCartCount();
}

// Update cart count display
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
}

document.addEventListener('DOMContentLoaded', updateCartCount);
