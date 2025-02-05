let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Cart Items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const totalAmount = document.getElementById('total-amount');
    checkoutItems.innerHTML = '';

    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty.</p>';
        totalAmount.textContent = '0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('checkout-item');
        itemDiv.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>₦${item.price} x ${item.quantity}</p>
            <p>Subtotal: ₦${item.price * item.quantity}</p>
        `;
        checkoutItems.appendChild(itemDiv);
        total += item.price * item.quantity;
    });

    totalAmount.textContent = total.toLocaleString();
    return total;
}

// Toggle Payment Methods
document.getElementById('payment-method').addEventListener('change', function () {
    const paymentMethod = this.value;
    const bankDetails = document.getElementById('bank-details');
    const paypalContainer = document.getElementById('paypal-button-container');
    const placeOrderBtn = document.getElementById('place-order-btn');

    bankDetails.style.display = paymentMethod === 'bank' ? 'block' : 'none';
    paypalContainer.style.display = paymentMethod === 'paypal' ? 'block' : 'none';
    placeOrderBtn.style.display = paymentMethod === 'paypal' ? 'none' : 'block';

    if (paymentMethod === 'paypal') {
        renderPayPalButton();
    }
});

// Render PayPal Button
function renderPayPalButton() {
    const total = displayCheckoutItems();
    document.getElementById('paypal-button-container').innerHTML = '';

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: (total / 1000).toFixed(2) // Assuming ₦1000 = $1 for simplicity
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert(`Thank you, ${details.payer.name.given_name}! Your payment was successful.`);
                processOrder('PayPal');
            });
        }
    }).render('#paypal-button-container');
}

// Handle Form Submission
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const paymentMethod = document.getElementById('payment-method').value;

    if (paymentMethod !== 'paypal') {
        processOrder(paymentMethod);
    }
});

// Process Order
function processOrder(paymentMethod) {
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerAddress = document.getElementById('customer-address').value;

    const order = {
        customer: {
            name: customerName,
            email: customerEmail,
            address: customerAddress,
            paymentMethod: paymentMethod
        },
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString()
    };

    console.log('Order Placed:', order);
    alert(`Thank you, ${customerName}! Your order has been placed successfully.`);

    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

// Initial Display
displayCheckoutItems();
// Show payment options based on the selected method
document.getElementById('payment-method').addEventListener('change', function() {
    const method = this.value;
    document.getElementById('bank-details').style.display = method === 'bank' ? 'block' : 'none';
    document.getElementById('paypal-button-container').style.display = method === 'paypal' ? 'block' : 'none';
});

// Initialize PayPal Buttons
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: document.getElementById('total-amount').textContent // Dynamic total
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
        });
    }
}).render('#paypal-button-container');
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Generate unique Order ID and Tracking ID
    const orderId = 'DC' + Date.now() + Math.floor(Math.random() * 1000);
    const trackingId = 'TRK' + Math.floor(100000 + Math.random() * 900000); // Example: TRK123456

    // Collect customer information
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const totalAmount = document.getElementById('total-amount').textContent;

    // Create an order object
    const orderDetails = {
        orderId,
        trackingId,
        name,
        email,
        address,
        paymentMethod,
        totalAmount,
        items: cart,
        date: new Date().toLocaleString(),
        status: "Processing"  // Initial status
    };

    // Save the order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Redirect to the tracking page with Order ID and Tracking ID
    window.location.href = `tracking.html?orderId=${orderId}&trackingId=${trackingId}`;
});
