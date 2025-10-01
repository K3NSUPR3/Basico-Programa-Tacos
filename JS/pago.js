document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirm-payment-btn');
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId'); // Este es el número de orden generado en cart.js

    // Puedes mostrar el ID de la orden actual al usuario si quieres
    // console.log("Orden temporal:", orderId);

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const tempOrderDataString = localStorage.getItem('tempOrderData');

            if (tempOrderDataString) {
                // El PHP ya no necesita los items, solo el número de orden
                const dataToSend = {
                    orderNumber: orderId // Solo enviamos el número de orden a la tabla 'ordenes'
                };

                // Enviamos los datos al segundo script PHP (insertar_orden.php)
                fetch('../PHP/insertar_orden.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend) // ¡Cambiado para enviar solo el número de orden!
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // On success, redirigir a la página de confirmación
                        localStorage.removeItem('tempOrderData'); // Limpiar los datos temporales
                        
                        // Redirige usando el orderId que ya tenemos
                        window.location.href = `order-confirmation.html?orderId=${orderId}`;
                    } else {
                        // Usar un modal o un elemento de UI en lugar de alert()
                        alert('Error en el pago: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Usar un modal o un elemento de UI en lugar de alert()
                    alert('Hubo un problema de conexión con el servidor de pago.');
                });
            } else {
                // Usar un modal o un elemento de UI en lugar de alert()
                alert('No se encontraron datos de la orden. Por favor, vuelve al carrito.');
                window.location.href = 'cart.html';
            }
        });
    }
});