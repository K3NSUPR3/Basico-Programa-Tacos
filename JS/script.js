const menuItems = [
  {
    id: "1",
    name: "Taco de Pollo Picante",
    description: "Pollo a la parrilla con jalapeños, cebollas y nuestra salsa picante exclusiva",
    price: 17,
    image: "../sourses/img/spicy-chicken-taco-with-jalape-os.jpg",
  },
  {
    id: "2",
    name: "Taco de Papa",
    description: "Papas frescas recien cortadas para un sabor casero",
    price: 15,
    image: "../sourses/img/Taco-Papa.jpg",
  },
  {
    id: "3",
    name: "Taco de Desebrada",
    description: "Taco desebrado de res con salsa ",
    price: 17,
    image: "../sourses/img/Taco-desebrada.jpg",
  },
  {
    id: "4",
    name: "Taco Vegetariano",
    description: "Verduras a la parrilla con frijoles negros y aguacate",
    price: 19,
    image: "../sourses/img/vegetarian-taco-with-grilled-vegetables-and-avocad.jpg",
  },
  {
    id: "5",
    name: "Taco de Chorizo",
    description: "Chorizo picante con huevos revueltos y queso fresco",
    price: 18,
    image: "../sourses/img/chorizo-taco-with-scrambled-eggs-and-cheese.jpg",
  },
  {
    id: "6",
    name: "Taco de Cochinita Pibil",
    description: "Carne de cerdo marinada en achiote y naranja agria, cocida lentamente",
    price: 22,
    image: "../sourses/img/pulled-pork-taco-with-coleslaw-and-pickled-onions.jpg",
  },
  {
    id: "7",
    name: "Taco de Carne Asada",
    description: "Tierna carne de res asada a la perfección, con cebolla y cilantro",
    price: 20,
    image: "../sourses/img/carne-asada-taco-with-guacamole-and-pico-de-gallo.jpg",
  },
  {
    id: "8",
    name: "Huevo cocido ",
    description: "Huevo cocido",
    price: 20,
    image: "../sourses/img/huevos-cocido.jpg",
  },
  {
    id: "9",
    name: "Coca Cola",
    description: "Cocacola-600ml",
    price: 20,
    image: "../sourses/img/Cocacola.jpeg",
  },
  
  {
    id: "10",
    name: "Agua de Jamaica",
    description: "Agua de Jamaica",
    price: 20,
    image: "../sourses/img/AguaJamaica.jpg",
  },
];

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const mainContent = document.getElementById("main-content");

function renderMenu() {
  const menuHtml = `
        <div class="menu-page">
            <h2 class="text-3xl font-bold text-center">Nuestro Menú</h2>
            <div class="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${menuItems
                  .map(
                    (item) => `
                    <div class="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-primary/50 transition-colors group">
                        <div class="p-0">
                            <div class="aspect-4-3 relative overflow-hidden rounded-t-lg">
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div class="p-4 space-y-3">
                                <div>
                                    <h3 class="font-semibold text-card-foreground text-lg">${item.name}</h3>
                                    <p class="text-muted-foreground text-sm mt-1">${item.description}</p>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xl font-bold text-primary">$${item.price.toFixed(2)}</span>
                                    <button
                                        data-id="${item.id}"
                                        class="btn btn-default"
                                    >
                                        <svg class="icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  mainContent.innerHTML = menuHtml;
  attachMenuListeners();
}

function updateCartCount() {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-item-count").textContent = cartCount;
}

function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function attachMenuListeners() {
  const addToCartButtons = mainContent.querySelectorAll(".btn-default");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = e.currentTarget.dataset.id;
      const itemToAdd = menuItems.find((item) => item.id === itemId);

      if (itemToAdd) {
        const existingItem = cartItems.find((item) => item.id === itemId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItems.push({ ...itemToAdd, quantity: 1 });
        }
        updateCartCount();
        saveCartToLocalStorage();
      }
    });
  });
}

// Llama a la función de renderizado del menú cuando se cargue la página
renderMenu();
updateCartCount();

// Añadir event listener para el botón del menú
document.getElementById("menu-btn").addEventListener("click", () => {
  renderMenu();
});