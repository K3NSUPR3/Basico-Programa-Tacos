// Function to generate a random order number (integrated from ordennumalea.js)
function generarNumeroPedido() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';

    const parteLetra = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
    const parteNumero = Array.from({ length: 3 }, () => numeros[Math.floor(Math.random() * numeros.length)]).join('');
    const parteFinal = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');

    return `#${parteLetra}${parteNumero}${parteFinal}`;
}

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const mainContent = document.getElementById("main-content");
const cartBadge = document.querySelector("#cart-item-count") || { textContent: '0' }; 


function updateCartCount() {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = cartCount;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Main rendering function (simplified HTML to focus on functionality)
function renderCart() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (cartItems.length === 0) {
        mainContent.innerHTML = `<div class="text-center py-16"><h2 class="text-2xl font-bold text-foreground mb-4">Tu Carrito está Vacío</h2></div>`;
        return;
    }

    const cartHtml = `
        <div class="space-y-8">
            <h2 class="text-3xl font-bold text-center">Tu Carrito</h2>
            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4" id="cart-items-container">
                    ${cartItems.map(item => `
                        <div class="card bg-card border-border p-4 flex items-center justify-between rounded-lg">
                            <img src="${item.image || '/placeholder.svg'}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover" />
                            <div class="flex-1 px-4">
                                <h3 class="font-semibold text-card-foreground">${item.name}</h3>
                                <p class="text-primary font-bold">$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button class="btn btn-outline btn-sm w-8 h-8 p-0" data-action="decrease" data-id="${item.id}">-</button>
                                <span class="w-8 text-center font-semibold">${item.quantity}</span>
                                <button class="btn btn-outline btn-sm w-8 h-8 p-0" data-action="increase" data-id="${item.id}">+</button>
                            </div>
                            <div class="font-semibold text-foreground ml-4">$${(item.price * item.quantity).toFixed(2)}</div>
                            <button data-id="${item.id}" data-action="remove" class="btn btn-ghost text-destructive ml-4">
                                <svg class="icon w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <div class="lg:col-span-1">
                    <div class="card bg-card border-border sticky top-4 p-4 space-y-4">
                        <h3 class="font-bold text-xl">Resumen del Pedido</h3>
                        <div class="flex justify-between border-t border-border pt-4">
                            <span class="text-lg font-bold">Total</span>
                            <span class="text-primary text-lg font-bold">$${total.toFixed(2)}</span>
                        </div>
                        <button id="checkout-btn" class="btn btn-default w-full" size="lg">PROCEDER A PAGO</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = cartHtml;
    attachCartListeners();
}

function attachCartListeners() {
    const cartItemsContainer = document.getElementById("cart-items-container");
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            // Logic to increase/decrease/remove
            const targetBtn = e.target.closest("button");
            if (!targetBtn) return;

            const action = targetBtn.dataset.action;
            const itemId = targetBtn.dataset.id;
            let item = cartItems.find(i => i.id === itemId);

            if (action === "increase") item.quantity++;
            if (action === "decrease") item.quantity--;
            if (item && item.quantity < 1 || action === "remove") {
                cartItems = cartItems.filter(i => i.id !== itemId);
            }

            saveCartToLocalStorage();
            renderCart();
            updateCartCount();
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length > 0) {
                // Generates the order number here, before the insertion
                const orderNumber = generarNumeroPedido();

                // Save cart data to localStorage for the next page to use
                localStorage.setItem('tempOrderData', JSON.stringify({
                    orderNumber: orderNumber,
                    items: cartItems
                }));
                
                // 1. Prepare data for the first insertion (into pedidos_web)
                const itemsForPedidosWeb = cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }));

                // Send the request to PHP to insert into pedidos_web
                fetch('../PHP/insertar_pedido_web.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemsForPedidosWeb)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // 2. On success, redirect to the payment page
                        window.location.href = `pago.html?orderId=${orderNumber}`;
                    } else {
                        alert('Error al procesar el pedido: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un problema de conexión con tu pedido.');
                });
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
});