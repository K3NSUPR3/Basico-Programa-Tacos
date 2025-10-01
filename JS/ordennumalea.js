// Script para obtener el número de orden de la URL (Pasado desde cart.js)
document.addEventListener('DOMContentLoaded', () => {
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const orderNumberElement = document.getElementById('order-number');

 if (orderId && orderNumberElement) {
  orderNumberElement.textContent = orderId;
 } else if (orderNumberElement) {
  orderNumberElement.textContent = '#Error de ID';
 }
});