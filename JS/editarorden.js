document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const tableBody = document.getElementById('products-table-body');
    const formTitle = document.getElementById('form-title');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productDescriptionInput = document.getElementById('product-description');

    // Función para obtener y mostrar los productos
    async function fetchProducts() {
        const response = await fetch('../PHP/obtener_productos.php?accion=obtener');
        const products = await response.json();
        renderProducts(products);
    }

    // Función para renderizar los productos en la tabla
    function renderProducts(products) {
        tableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'border-b border-border hover:bg-card-hover';
            row.innerHTML = `
                <td class="py-2 px-4">${product.id}</td>
                <td class="py-2 px-4">${product.nombre}</td>
                <td class="py-2 px-4">$${parseFloat(product.precio).toFixed(2)}</td>
                <td class="py-2 px-4 space-x-2">
                    <button class="btn btn-default btn-edit" data-id="${product.id}" data-name="${product.nombre}" data-price="${product.precio}" data-description="${product.descripcion}">
                        Editar
                    </button>
                    <button class="btn btn-ghost text-destructive btn-delete" data-id="${product.id}">
                        Eliminar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Adjuntar listeners a los nuevos botones
        attachTableListeners();
    }

    // Listener para el formulario (agregar y editar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = productIdInput.value;
        const accion = id ? 'editar' : 'agregar';

        const formData = new FormData(form);
        formData.append('accion', accion);

        await fetch('../PHP/obtener_productos.php', {
            method: 'POST',
            body: formData
        });

        form.reset();
        productIdInput.value = '';
        formTitle.textContent = 'Agregar Nuevo Producto';
        cancelBtn.classList.add('hidden');
        fetchProducts();
    });

    // Función para adjuntar listeners a los botones de la tabla
    function attachTableListeners() {
        // Editar
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const name = e.target.dataset.name;
                const price = e.target.dataset.price;
                const description = e.target.dataset.description;

                productIdInput.value = id;
                productNameInput.value = name;
                productPriceInput.value = price;
                productDescriptionInput.value = description;

                formTitle.textContent = `Editar Producto #${id}`;
                cancelBtn.classList.remove('hidden');
            });
        });

        // Eliminar
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    const id = e.target.dataset.id;
                    const formData = new FormData();
                    formData.append('accion', 'eliminar');
                    formData.append('id', id);

                    await fetch('../PHP/obtener_ordenproductos.php', {
                        method: 'POST',
                        body: formData
                    });

                    fetchProducts();
                }
            });
        });
    }

    // Listener para el botón de cancelar
    cancelBtn.addEventListener('click', () => {
        form.reset();
        productIdInput.value = '';
        formTitle.textContent = 'Agregar Nuevo Producto';
        cancelBtn.classList.add('hidden');
    });

    // Cargar los productos al iniciar la página
    fetchProducts();
});