

// Efecto de menú flotante con scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 200) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Animación suave para los elementos flotantes
document.addEventListener('DOMContentLoaded', function() {
    const floatElements = document.querySelectorAll('.float-element');
    
    floatElements.forEach((element, index) => {
        element.style.fontSize = '24px';
        element.style.animationDelay = `${index * 1.5}s`;
    });

    // ========== CÓDIGO DEL SLIDER (solo si existe) ==========
    const sliderSection = document.querySelector('.slider-section');
    
    if (sliderSection) {
        sliderSection.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        sliderSection.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const sliderWrapper = document.getElementById('sliderWrapper');
        const totalSlides = slides.length;

        if (slides.length > 0) {
            function showSlide(index) {
                sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
                currentSlideIndex = index;
            }

            function nextSlide() {
                currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                showSlide(currentSlideIndex);
            }

            function previousSlide() {
                currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
                showSlide(currentSlideIndex);
            }

            let slideInterval = setInterval(nextSlide, 5000);

            sliderSection.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            sliderSection.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') {
                    previousSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            });

            let touchStartX = 0;
            let touchEndX = 0;

            sliderSection.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            sliderSection.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        previousSlide();
                    }
                }
            });
        }
    }

    // ========== CÓDIGO DE PRODUCTOS - ORDENAMIENTO ==========
    function sortProducts(criteria) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        const products = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        products.sort((a, b) => {
            switch(criteria) {
                case 'price-low':
                    // Ordenar por precio de menor a mayor
                    const priceA = parseInt(a.dataset.productPrice);
                    const priceB = parseInt(b.dataset.productPrice);
                    return priceA - priceB;
                
                case 'price-high':
                    // Ordenar por precio de mayor a menor
                    const priceA2 = parseInt(a.dataset.productPrice);
                    const priceB2 = parseInt(b.dataset.productPrice);
                    return priceB2 - priceA2;
                
                case 'name':
                    // Ordenar por nombre A-Z
                    const nameA = a.dataset.productName.toLowerCase();
                    const nameB = b.dataset.productName.toLowerCase();
                    return nameA.localeCompare(nameB);
                
                case 'newest':
                    // Ordenar por ID (más recientes primero)
                    const idA = parseInt(a.dataset.productId);
                    const idB = parseInt(b.dataset.productId);
                    return idB - idA;
                
                case 'featured':
                default:
                    // Orden original (más vendidos - por ID ascendente)
                    const idA2 = parseInt(a.dataset.productId);
                    const idB2 = parseInt(b.dataset.productId);
                    return idA2 - idB2;
            }
        });

        // Limpiar el grid y reagregar productos ordenados
        productsGrid.innerHTML = '';
        products.forEach(product => productsGrid.appendChild(product));
    }
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            const sortValue = e.target.value;
            sortProducts(sortValue);
        });
    }

    // CÓDIGO DE VIDEOS 
    const videos = document.querySelectorAll('.video-container video');
    
    videos.forEach(video => {
        video.addEventListener('ended', function() {
            const overlay = this.parentElement.querySelector('.video-overlay');
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });
        
        video.addEventListener('click', function() {
            const overlay = this.parentElement.querySelector('.video-overlay');
            if (this.paused) {
                this.play();
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            } else {
                this.pause();
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            }
        });
    });

    // ========== CÓDIGO DEL MAPA (solo si existe) ==========
    const mapElement = document.getElementById('map');
    
    if (mapElement && typeof L !== 'undefined') {  // Verificar si Leaflet está cargado
        const lat = 8.269996;
        const lng = -73.365616;

        const map = L.map('map', {
            zoomControl: true
        }).setView([lat, lng], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        const customIcon = L.divIcon({
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
            <div style="text-align: center; padding: 5px;">
                <strong style="font-size: 16px; color: #ff1493;">Postre Manía</strong><br>
                <span style="color: #666; font-size: 13px;">Cl. 5B # 1-37, Ocaña</span><br>
                <a href="https://www.google.com/maps/dir//${lat},${lng}" target="_blank" 
                   style="color: #ff69b4; text-decoration: none; font-size: 13px; margin-top: 5px; display: inline-block;">
                   Cómo llegar →
                </a>
            </div>
        `).openPopup();

        L.circle([lat, lng], {
            color: '#ff69b4',
            fillColor: '#ff69b4',
            fillOpacity: 0.1,
            radius: 50
        }).addTo(map);
    }

    // ========== CÓDIGO DEL CARRITO DE COMPRAS CON CONFIGURACIÓN ==========
    let cartData = [];
    let currentProductConfig = null;
    let selectedVariant = null;
    let selectedSauces = [];
    let selectedToppings = [];

    // Salsas disponibles globalmente
    const availableSauces = ["Leche condensada", "Chocolate", "Arequipe", "Mora", "Fresa", "Crema de avellana"];

    // Toppings disponibles globalmente
    const availableToppings = [
        "Chips de chocolate", "Chips de colores", "Lluvia de chocolate", "Lluvia de colores",
        "Galleta oreo", "Galleta waffer", "Chocolatina gol", "Gansito", "Galleta milo",
        "Chispitas de colores", "M&M de corazon", "Barquillos", "Gomitas", "Chocoramo",
        "Choco crispis", "Chocmelos", "Quipitos", "Moritas", "Chicle"
    ];

    const cartButton = document.getElementById('cartButton');
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    // Elementos del modal de configuración
    const productModalOverlay = document.getElementById('productModalOverlay');
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalProductName = document.getElementById('modalProductName');
    const modalBody = document.getElementById('modalBody');
    const modalTotal = document.getElementById('modalTotal');
    const modalAddToCart = document.getElementById('modalAddToCart');

    // Abrir carrito
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            cartPanel.classList.add('open');
            cartOverlay.classList.add('active');
        });
    }

    // Cerrar carrito
    if (closeCart) {
        closeCart.addEventListener('click', closeCartPanel);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartPanel);
    }

    function closeCartPanel() {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('active');
    }

    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }

    if (productModalOverlay) {
        productModalOverlay.addEventListener('click', closeProductModal);
    }

    function closeProductModal() {
        productModal.classList.remove('active');
        productModalOverlay.classList.remove('active');
        resetModalState();
    }

    function resetModalState() {
        currentProductConfig = null;
        selectedVariant = null;
        selectedSauces = [];
        selectedToppings = [];
        modalBody.innerHTML = '';
    }

    // Formatear precio
    function formatPrice(price) {
        return '$' + price.toLocaleString('es-CO');
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('hidden', totalItems === 0);
        }
    }

    // Abrir modal de configuración
    function openProductModal(productId, productName, productEmoji, productConfig) {
        currentProductConfig = {
            id: productId,
            name: productName,
            emoji: productEmoji,
            ...productConfig //operador spread para incluir variantes, salsas, toppings
        };

        modalProductName.textContent = productName;
        renderModalContent();
        
        productModal.classList.add('active');
        productModalOverlay.classList.add('active');
    }

    // Renderizar contenido del modal
    function renderModalContent() {
        if (!currentProductConfig) return;

        let html = '';

        // Sección de variantes
        if (currentProductConfig.variants && currentProductConfig.variants.length > 0) {
            html += `
                <div class="config-section required">
                    <h3>Selecciona el tamaño</h3>
                    <div class="variant-options">
                        ${currentProductConfig.variants.map(variant => `
                            <div class="variant-option ${selectedVariant?.id === variant.id ? 'selected' : ''}" 
                                 onclick="selectVariant('${variant.id}')">
                                <div class="variant-info">
                                    <div class="variant-name">${variant.name}</div>
                                    <div class="variant-description">${variant.description}</div>
                                </div>
                                <div class="variant-price">${formatPrice(variant.price)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Sección de salsas
        if (selectedVariant && (selectedVariant.sauces || 0) > 0) {
            const maxSauces = selectedVariant.sauces;
            const extraCost = selectedSauces.length > maxSauces ? (selectedSauces.length - maxSauces) * 2000 : 0;
            
            html += `
                <div class="config-section">
                    <h3>Selecciona las salsas</h3>
                    <div class="selection-limit">
                        <span class="selection-counter">${selectedSauces.length}/${maxSauces}</span> incluidas
                        ${selectedSauces.length > maxSauces ? `<span style="color: #f44;"> (+${selectedSauces.length - maxSauces} extra)</span>` : ''}
                    </div>
                    <div class="selection-grid">
                        ${availableSauces.map(sauce => `
                            <div class="selection-item ${selectedSauces.includes(sauce) ? 'selected' : ''}"
                                 onclick="toggleSauce('${sauce}')">
                                ${sauce}
                            </div>
                        `).join('')}
                    </div>
                    ${extraCost > 0 ? `
                        <div class="extra-cost-notice">
                            ⚠️ Salsas adicionales: +${formatPrice(extraCost)}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Sección de toppings (CON SOPORTE PARA TOPPINGS PERSONALIZADOS)
        if (selectedVariant && (selectedVariant.toppings || 0) > 0) {
            const maxToppings = selectedVariant.toppings;
            const extraCost = selectedToppings.length > maxToppings ? (selectedToppings.length - maxToppings) * 2000 : 0;
            
            // Determinar qué toppings mostrar
            let toppingsToShow = availableToppings;
            if (selectedVariant.customToppings && selectedVariant.customToppings.length > 0) {
                toppingsToShow = selectedVariant.customToppings;
            }
            
            html += `
                <div class="config-section">
                    <h3>Selecciona los toppings</h3>
                    <div class="selection-limit">
                        <span class="selection-counter">${selectedToppings.length}/${maxToppings}</span> incluidos
                        ${selectedToppings.length > maxToppings ? `<span style="color: #f44;"> (+${selectedToppings.length - maxToppings} extra)</span>` : ''}
                    </div>
                    <div class="selection-grid">
                        ${toppingsToShow.map(topping => `
                            <div class="selection-item ${selectedToppings.includes(topping) ? 'selected' : ''}"
                                 onclick="toggleTopping('${topping}')">
                                ${topping}
                            </div>
                        `).join('')}
                    </div>
                    ${extraCost > 0 ? `
                        <div class="extra-cost-notice">
                            ⚠️ Toppings adicionales: +${formatPrice(extraCost)}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        modalBody.innerHTML = html;
        updateModalTotal();
    }

    // Seleccionar variante
    window.selectVariant = function(variantId) {
        const variant = currentProductConfig.variants.find(v => v.id === variantId);
        if (variant) {
            selectedVariant = variant;
            selectedSauces = [];
            selectedToppings = [];
            renderModalContent();
        }
    }

    // Toggle salsa
    window.toggleSauce = function(sauce) {
        const index = selectedSauces.indexOf(sauce);
        if (index > -1) {
            selectedSauces.splice(index, 1);
        } else {
            selectedSauces.push(sauce);
        }
        renderModalContent();
    }

    // Toggle topping
    window.toggleTopping = function(topping) {
        const index = selectedToppings.indexOf(topping);
        if (index > -1) {
            selectedToppings.splice(index, 1);
        } else {
            selectedToppings.push(topping);
        }
        renderModalContent();
    }

    // Actualizar total del modal
    function updateModalTotal() {
        let total = 0;
        
        if (selectedVariant) {
            total = selectedVariant.price;
            
            // Calcular extras de salsas
            const maxSauces = selectedVariant.sauces || 0;
            if (selectedSauces.length > maxSauces) {
                total += (selectedSauces.length - maxSauces) * 2000;
            }
            
            // Calcular extras de toppings
            const maxToppings = selectedVariant.toppings || 0;
            if (selectedToppings.length > maxToppings) {
                total += (selectedToppings.length - maxToppings) * 2000;
            }
        }
        
        modalTotal.textContent = formatPrice(total);
        
        // Habilitar/deshabilitar botón
        modalAddToCart.disabled = !selectedVariant;
    }

    // Agregar al carrito desde el modal
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', () => {
            if (!selectedVariant) return;
            
            const productToAdd = {
                id: Date.now(),
                productId: currentProductConfig.id,
                name: currentProductConfig.name,
                emoji: currentProductConfig.emoji,
                variant: selectedVariant.name,
                variantDescription: selectedVariant.description,
                price: selectedVariant.price,
                sauces: [...selectedSauces],
                toppings: [...selectedToppings],
                quantity: 1
            };
            
            // Calcular precio total con extras
            const maxSauces = selectedVariant.sauces || 0;
            const maxToppings = selectedVariant.toppings || 0;
            const extraSauces = Math.max(0, selectedSauces.length - maxSauces);
            const extraToppings = Math.max(0, selectedToppings.length - maxToppings);
            productToAdd.price += (extraSauces + extraToppings) * 2000;
            
            cartData.push(productToAdd);
            
            updateCartCount();
            renderCart();
            closeProductModal();
            
            // Abrir carrito
            cartPanel.classList.add('open');
            cartOverlay.classList.add('active');
        });
    }

    // Renderizar carrito
    function renderCart() {
        if (cartData.length === 0) {
            if (cartFooter) cartFooter.style.display = 'none';
            if (cartItems) {
                cartItems.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Tu carrito está vacío</p><p>¡Agrega algunos postres deliciosos!</p></div>';
            }
            return;
        }

        if (cartFooter) cartFooter.style.display = 'block';

        if (cartItems) {
            cartItems.innerHTML = cartData.map(item => `
                <div class="cart-item">
                    <div class="cart-item-content">
                        <div class="cart-item-image">${item.emoji}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div style="font-size: 13px; color: #666; margin-bottom: 5px;">
                                ${item.variant}
                            </div>
                            ${item.sauces && item.sauces.length > 0 ? `
                                <div style="font-size: 12px; color: #888; margin-bottom: 3px;">
                                    Salsas: ${item.sauces.join(', ')}
                                </div>
                            ` : ''}
                            ${item.toppings && item.toppings.length > 0 ? `
                                <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
                                    Toppings: ${item.toppings.join(', ')}
                                </div>
                            ` : ''}
                            <div class="cart-item-price">${formatPrice(item.price)}</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <button class="remove-item" onclick="removeItem(${item.id})">🗑️</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        Subtotal: <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                </div>
            `).join('');
        }

        updateCartTotal();
    }

    // Actualizar total
    function updateCartTotal() {
        const total = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartSubtotal) cartSubtotal.textContent = formatPrice(total);
        if (cartTotal) cartTotal.textContent = formatPrice(total);
    }

    // Actualizar cantidad
    window.updateQuantity = function(id, change) {
        const item = cartData.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cartData = cartData.filter(item => item.id !== id);
            }
        }
        updateCartCount();
        renderCart();
    }

    // Eliminar item
    window.removeItem = function(id) {
        cartData = cartData.filter(item => item.id !== id);
        updateCartCount();
        renderCart();
    }

    // Vaciar carrito
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cartData = [];
                updateCartCount();
                renderCart();
            }
        });
    }

    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const message = cartData.map(item => {
                let itemText = `${item.name} - ${item.variant} x${item.quantity}`;
                if (item.sauces && item.sauces.length > 0) {
                    itemText += `%0A  Salsas: ${item.sauces.join(', ')}`;
                }
                if (item.toppings && item.toppings.length > 0) {
                    itemText += `%0A  Toppings: ${item.toppings.join(', ')}`;
                }
                itemText += `%0A  Precio: ${formatPrice(item.price * item.quantity)}`;
                return itemText;
            }).join('%0A%0A');
            
            const total = formatPrice(cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0));
            const whatsappMessage = `¡Hola! Me gustaría hacer el siguiente pedido:%0A%0A${message}%0A%0A*Total: ${total}*`;
            
          window.location.href = `https://wa.me/573123098686?text=${encodeURIComponent(whatsappMessage)}`;
        });
    }

    // Event listeners para botones de agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const id = parseInt(productCard.dataset.productId);
            const name = productCard.dataset.productName;
            const emoji = productCard.dataset.productEmoji;
            const configData = productCard.dataset.productConfig;
            
            if (configData) {
                try {
                    const config = JSON.parse(configData);
                    openProductModal(id, name, emoji, config);
                } catch (error) {
                    console.error('Error al parsear configuración:', error);
                    alert('Error al configurar el producto');
                }
            }
        });
    });

    // Inicializar
    updateCartCount();

    // ========== AUTO-ABRIR MODAL DE PRODUCTO DESDE URL ==========
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('openProduct');
    
    if (productId) {
        setTimeout(() => {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            
            if (productCard) {
                productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                        addToCartBtn.click();
                    }
                }, 500);
            }
        }, 300);
    }
});