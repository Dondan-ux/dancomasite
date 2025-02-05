// cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout'); // Updated ID

// Update cart count and total price
function updateCart() {
    cartCount.textContent = cart.length;
    let totalPrice = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Price: ₦${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function () {
            const itemIndex = parseInt(this.getAttribute('data-index'));
            removeItem(itemIndex);
        });
    });
}

// Function to remove an item from the cart
function removeItem(index) {
    if (isNaN(index) || index < 0 || index >= cart.length) {
        console.error('Invalid item index:', index);
        return;
    }

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Proceed to Checkout button functionality
if (proceedToCheckoutBtn) { // Ensure the button exists
    proceedToCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html'; // Redirect to checkout page
    });
}

// Adding item to cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productId = parseInt(this.getAttribute('data-id'));
        const productName = this.getAttribute('data-name');
        const productPrice = parseInt(this.getAttribute('data-price'));

        if (isNaN(productId)) {
            console.error('Invalid product ID:', productId);
            return;
        }

        const existingItem = cart.find(item => item.id === productId);

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
        updateCart();
    });
});

// Initial cart update
updateCart();
