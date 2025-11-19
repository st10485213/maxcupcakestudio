// ====================================
// 1. PRODUCT DATA ARRAY (6 CUPCAKES)
// ====================================

const CUPCAKES = [
    {
        id: 1,
        name: "Red Velvet Classic",
        category: "classic",
        price: 65.00,
        description: "Rich cocoa sponge with tangy cream cheese frosting.",
        imageSrc: "images/red velvet 2.jpg", 
        altText: "Red Velvet Cupcake"
    },
    {
        id: 2,
        name: "Midnight Chocolate",
        category: "classic", 
        price: 60.00,
        description: "Dark chocolate cake topped with a silky chocolate ganache.",
        imageSrc: "images/midnight choco cupcake.jpg",
        altText: "Midnight Chocolate Cupcake"
    },
    {
        id: 3,
        name: "Vanilla Bean Dream",
        category: "classic",
        price: 55.00,
        description: "Moist vanilla bean cake with classic buttercream swirls.",
        imageSrc: "images/vanilla bean.jpg",
        altText: "Vanilla Bean Cupcake"
    },
    {
        id: 4,
        name: "Salted Caramel Pretzel",
        category: "gourmet", 
        price: 70.00,
        description: "Caramel swirl cake, salted caramel frosting, topped with a mini pretzel.",
        imageSrc: "images/salted caramel pretzel.jpg",
        altText: "Salted Caramel Pretzel Cupcake"
    },
    {
        id: 5,
        name: "Matcha Pistachio",
        category: "gourmet", 
        price: 68.00,
        description: "Delicate matcha sponge with pistachio cream filling and crushed nuts.",
        imageSrc: "images/matcha pistachio.jpg",
        altText: "Matcha Pistachio Cupcake"
    },
    {
        id: 6,
        name: "Dark Cherry Forest",
        category: "gourmet", 
        price: 69.00,
        description: "Dark chocolate cake infused with kirsch, topped with fresh cherries and cream.",
        imageSrc: "images/black forest 2.jpg",
        altText: "Black Forest Cupcake"
    }
];

// ====================================
// 2. CART MANAGEMENT FUNCTIONS (localStorage)
// ====================================

const CART_KEY = 'maxsCupcakeStudioCart';

function getCart() {
    const cartJson = localStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, quantity) {
    const cart = getCart();
    const product = CUPCAKES.find(c => c.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    if (document.getElementById('order-summary')) {
        renderOrderSummary(); 
    }
}


// ====================================
// 3. MENU PAGE FUNCTIONS
// ====================================

function renderCupcakes(cupcakeArray) {
    const grid = document.querySelector('.cupcake-grid');
    if (!grid) return; 
    
    grid.innerHTML = ''; 

    cupcakeArray.forEach(cupcake => {
        const card = document.createElement('div');
        card.classList.add('cupcake-card');
        card.setAttribute('data-id', cupcake.id);
        
        card.innerHTML = `
            <img src="${cupcake.imageSrc}" alt="${cupcake.altText}" class="cupcake-image" data-name="${cupcake.name}">
            <h4>${cupcake.name}</h4>
            <p>${cupcake.description}</p>
            <p class="price">R ${cupcake.price.toFixed(2)} each</p>
            
            <form class="add-to-cart-form" data-product-id="${cupcake.id}" data-product-name="${cupcake.name}">
                <input type="number" class="quantity-input" value="1" min="1">
                <button type="submit" class="add-btn">Add to Cart</button>
            </form>
        `;
        
        grid.appendChild(card);
    });
    
    setupLightboxListeners();
    setupCartListeners(); 
}

function setupLightboxListeners() {
    const images = document.querySelectorAll('.cupcake-image');
    const lightbox = document.getElementById('myLightbox'); 
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!lightbox) return;

    images.forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightboxCaption.textContent = e.target.getAttribute('data-name');
            lightbox.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}

function filterCupcakes(category) {
    let filteredProducts;

    if (category === 'all') {
        filteredProducts = CUPCAKES;
    } else {
        filteredProducts = CUPCAKES.filter(cupcake => cupcake.category === category);
    }

    renderCupcakes(filteredProducts);
}


function initiateCupcakeShower(count = 15) {
    const container = document.getElementById('cupcake-shower-container');
    if (!container) return;

    const spawnAreaWidth = container.offsetWidth;

    for (let i = 0; i < count; i++) {
        const cupcake = document.createElement('div');
        cupcake.classList.add('cupcake-pop');
        
        const startX = Math.random() * spawnAreaWidth;
        cupcake.style.left = `${startX}px`;
        
        cupcake.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(cupcake);

        cupcake.addEventListener('animationend', () => {
            cupcake.remove();
        });
    }
}

function setupCartListeners() {
    const addForms = document.querySelectorAll('.add-to-cart-form');
    addForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productId = parseInt(form.getAttribute('data-product-id'));
            const quantity = parseInt(form.querySelector('.quantity-input').value);
            
            addToCart(productId, quantity);
            
            initiateCupcakeShower(); 
            
            const btn = form.querySelector('.add-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Added! 🎉';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        });
    });
}


// ====================================
// 4. CHECKOUT PAGE FUNCTIONS
// ====================================

function renderOrderSummary() {
    const cart = getCart();
    const tbody = document.getElementById('cart-tbody');
    const totalRow = document.getElementById('total-row');

    if (!tbody || !totalRow) return;

    tbody.innerHTML = '';
    let subtotal = 0;
    const TAX_RATE = 0.15; 
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Your cart is empty. <a href="menu.html">Go to Menu</a></td></tr>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R ${item.price.toFixed(2)}</td>
                <td>R ${itemTotal.toFixed(2)}</td>
            `;
        });
    }

    const taxAmount = subtotal * TAX_RATE;
    const finalTotal = subtotal + taxAmount;

    totalRow.innerHTML = `
        <tr class="summary-row">
            <td colspan="3" style="text-align: right;">Subtotal:</td>
            <td>R ${subtotal.toFixed(2)}</td>
        </tr>
        <tr class="summary-row">
            <td colspan="3" style="text-align: right;">VAT (15%):</td>
            <td>R ${taxAmount.toFixed(2)}</td>
        </tr>
        <tr class="total-row">
            <td colspan="3" style="text-align: right;">Final Total:</td>
            <td id="final-total-display">R ${finalTotal.toFixed(2)}</td>
        </tr>
    `;

    totalRow.setAttribute('data-final-total', finalTotal.toFixed(2));
}

function setupCheckoutListeners() {
    const clearButton = document.getElementById('clear-cart-btn');
    const submitForm = document.getElementById('checkout-form');
    const modal = document.getElementById('orderSuccessModal');

    if (clearButton) {
        clearButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to clear your entire order?')) {
                clearCart();
            }
        });
    }

    if (submitForm) {
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const totalDisplay = document.getElementById('total-row');
            const finalTotal = totalDisplay ? totalDisplay.getAttribute('data-final-total') : '0.00';
            
            if (getCart().length === 0) {
                alert("Your cart is empty. Please add items before placing an order.");
                return;
            }

            if (modal) {
                document.getElementById('modal-total').textContent = `Total: R${finalTotal}`;
                modal.style.display = 'flex';
                
                clearCart(); 
            }
        });
    }

    if (modal) {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }
}


// ====================================
// 5. CONTACT PAGE MAP FUNCTION
// ====================================

/**
 * Initializes the Google Map on the contact.html page.
 * NOTE: This is called via the callback parameter in the Google Maps API script tag.
 */
function initMap() {
    if (!document.getElementById("map")) return;
    
    // Coordinates for Max's Cupcake Studio (Placeholder)
    const studioLocation = { lat: 40.7291, lng: -73.9859 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: studioLocation,
    });

    const marker = new google.maps.Marker({
        position: studioLocation,
        map: map,
        title: "Max's Cupcake Studio",
    });

    const infoWindow = new google.maps.InfoWindow({
        content: '<h5>Max\'s Cupcake Studio</h5><p>171 E 10th St, New York</p><a href="https://maps.app.goo.gl/P73p1B7D1k7g1R7" target="_blank">Get Directions</a>',
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}


// ====================================
// 6. INITIALIZATION ON PAGE LOAD
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const isMenuPage = document.querySelector('.cupcake-grid');
    const isCheckoutPage = document.getElementById('order-summary');

    // Menu Page Initialization
    if (isMenuPage) {
        renderCupcakes(CUPCAKES); 
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedCategory = e.target.getAttribute('data-category');
                filterCupcakes(selectedCategory);

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // Checkout Page Initialization
    if (isCheckoutPage) {
        renderOrderSummary();
        setupCheckoutListeners();
    }
    
    // NOTE: The Map Initialization (initMap) is handled by the Google Maps script callback, 
    // not directly in DOMContentLoaded.
});
/**
 * 7. CONTACT FORM VALIDATION
 */
function setupContactFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        // Simple validation checks
        if (!name || !email || !message) {
            alert('Please fill out all required fields.');
            return;
        }

        // Basic email format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // If validation passes, simulate success
        alert('Thank you for your message, ' + name + '! We will get back to you shortly.');
        
        // Clear the form fields after successful submission
        form.reset();
    });
}

// Add this function call to your main initialization block in script.js:
// ... inside document.addEventListener('DOMContentLoaded', () => { ...

    // Contact Page Initialization
    setupContactFormValidation();
    

// ...