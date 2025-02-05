// Hamburger Menu Toggle
document.getElementById('hamburger').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Slide Animation (if needed)
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(showNextSlide, 8000);  // Change slide every 8 seconds

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage

// Update Cart Display
function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// Add-to-Cart Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-name');  
        const productPrice = parseInt(this.getAttribute('data-price'));  
        const productId = `${productName}-${Date.now()}`;

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: `assets/images/${productName.toLowerCase()}.jpg`
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showAlert(`${productName} added to cart!`);
    });
});

// Show Alert Function
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert');
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

// Cart Page - Display Items
function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <p>${item.name}</p>
                <p>₦${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            cartContainer.appendChild(itemDiv);
        });
    }
}

// Remove item from cart functionality
document.getElementById('cart-container').addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.getAttribute('data-id');
        cart = cart.filter(item => item.id !== itemId);  // Remove by unique ID
        updateCartDisplay();
        displayCart();
        showAlert(`Item removed from cart.`);
    }
});

// Checkout functionality
document.getElementById('checkout-btn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to the cart first.');
    } else {
        window.location.href = 'checkout.html';
    }
});

// Initial cart display
updateCartDisplay();
displayCart();

// Pepper Animation
const pepperRainContainer = document.getElementById('pepper-rain');

function createPepper() {
    const pepper = document.createElement('div');
    pepper.classList.add('pepper');
    pepper.style.backgroundImage = 'url("assets/images/pepper.png")';
    pepper.style.left = `${Math.random() * 100}vw`;
    pepper.style.animationDuration = `${Math.random() * 3 + 2}s`;

    pepperRainContainer.appendChild(pepper);

    setTimeout(() => {
        pepper.remove();
    }, 5000);
}

setInterval(createPepper, 200);
