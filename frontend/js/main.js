document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentCategory = 'groceries';
    let currentLocation = 'default';
    let cart = JSON.parse(localStorage.getItem('velox_cart')) || [];
    let inventory = [];
    
    // --- Cursor State & Logic ---
    const cursorFollower = document.getElementById('cursor-follower');
    const liquidContainer = document.getElementById('liquid-cursor-container');
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let spawnTimeout = null;

    // Category to Items Mapping for the Liquid Cursor
    const cursorItems = {
        'groceries': ['🍎', '🥦', '🍞', '🧀', '🥩', '🥚'],
        'tech': ['🔌', '🎧', '🔋', '⌨️', '🖱️', '💻'],
        'pharmacy': ['💊', '🩹', '⚕️', '🤧', '🩸'],
        'cafe': ['☕', '🥐', '🥯', '🍩', '🥤'],
        'meat': ['🥩', '🍗', '🥓', '🍔'],
        'fresh': ['🍅', '🥑', '🥒', '🥗', '🍓']
    };

    // --- Location Selector Modal ---
    const locSelector = document.getElementById('location-selector');
    const locText = document.getElementById('loc-text');
    const searchInput = document.querySelector('.search-bar input');
    
    const locModal = document.getElementById('location-modal');
    const locOptionBtns = document.querySelectorAll('.location-option-btn');
    const customLocInput = document.getElementById('custom-location-input');
    const customLocBtn = document.getElementById('custom-location-btn');
    
    function setLocation(newLoc) {
        if(newLoc && newLoc.trim() !== '') {
            locText.textContent = newLoc.trim();
            currentLocation = newLoc.trim().toLowerCase();
            if(searchInput) {
                searchInput.placeholder = `Search for items near ${newLoc.trim()}`;
            }
            if(locModal) locModal.style.display = 'none';
            loadCategory(currentCategory); // Reload items for new location
        }
    }

    if(locSelector && locModal) {
        locSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = locModal.style.display === 'block';
            locModal.style.display = isVisible ? 'none' : 'block';
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if(!locSelector.contains(e.target) && !locModal.contains(e.target)) {
                locModal.style.display = 'none';
            }
        });
        
        locOptionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                setLocation(e.currentTarget.dataset.loc);
            });
        });
        
        if(customLocBtn) {
            customLocBtn.addEventListener('click', () => {
                setLocation(customLocInput.value);
            });
            customLocInput.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') {
                    setLocation(customLocInput.value);
                }
            });
        }
    }

    // Track Mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        // Move the main follower bubble
        if(cursorFollower) {
            cursorFollower.style.left = `${mouseX}px`;
            cursorFollower.style.top = `${mouseY}px`;
        }

        // Spawn a liquid particle occasionally when moving
        if(!spawnTimeout) {
            spawnParticle(mouseX, mouseY);
            spawnTimeout = setTimeout(() => {
                spawnTimeout = null;
            }, 80); // Spawn rate
        }
    });

    function spawnParticle(x, y) {
        if(!liquidContainer) return;
        
        const items = cursorItems[currentCategory] || cursorItems['groceries'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.textContent = randomItem;
        
        // Initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random float direction
        const tx = (Math.random() - 0.5) * 100 + 'px';
        const ty = (Math.random() - 1) * 100 + 'px'; // mostly upwards
        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);
        
        liquidContainer.appendChild(particle);
        
        // Cleanup after animation
        setTimeout(() => {
            if(particle.parentNode) particle.remove();
        }, 1000);
    }

    // --- Elements ---
    const catPills = document.querySelectorAll('.cat-pill');
    const productGrid = document.getElementById('product-grid');
    const catTitle = document.getElementById('category-title');
    const cartBtns = document.querySelectorAll('.cart-toggle');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('velocity-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCountEl = document.getElementById('cart-count');
    const rxInput = document.getElementById('rx-input');

    // --- Initialization ---
    updateCartCount();
    loadCategory(currentCategory);
    
    // --- User Profile State ---
    const user = localStorage.getItem('velox_user');
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    const userDropdown = document.getElementById('user-dropdown');
    const signoutBtn = document.getElementById('signout-btn');
    
    if(user && loginBtn) {
        loginText.textContent = user;
        loginBtn.onclick = null; // Remove redirect
        loginBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = userDropdown.style.display === 'block';
            userDropdown.style.display = isVisible ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if(userDropdown && !loginBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });
        
        if(signoutBtn) {
            signoutBtn.addEventListener('click', () => {
                localStorage.removeItem('velox_user');
                window.location.reload();
            });
        }
    }

    // --- Tabs / Category Ribbon ---
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            if(!pill.dataset.category) return; // Mock categories do nothing
            
            catPills.forEach(t => t.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            
            // Capitalize for title
            catTitle.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
            
            if(currentCategory === 'pharmacy' && rxInput) {
                rxInput.classList.add('active');
            } else if (rxInput) {
                rxInput.classList.remove('active');
            }
            
            loadCategory(currentCategory);
        });
    });

    // --- Inventory Load & Display ---
    async function loadCategory(category) {
        if (!window.api) return;
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Loading fresh items...</p>';
        const data = await window.api.getInventory(category, currentLocation);
        
        if (data && data.items) {
            inventory = data.items;
            renderProducts();
        }
    }

    // --- Functional Search ---
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if(!query) {
                renderProducts();
                return;
            }
            const filtered = inventory.filter(item => item.name.toLowerCase().includes(query));
            renderProducts(filtered);
        });
    }

    // --- Product Preview Modal ---
    let previewModal = document.getElementById('preview-modal');
    
    // CACHE BUSTER FIX: If the user has an old cached index.html, the new elements won't exist.
    // Let's dynamically inject the new modal if it's missing the new elements.
    if (!document.getElementById('preview-stars')) {
        if (previewModal) previewModal.remove(); // Remove old
        const newModalHTML = `
        <div id="preview-modal" class="drawer-overlay" style="z-index: 10000; display: none; align-items: center; justify-content: center;">
            <div style="background: white; width: 95%; max-width: 1000px; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position: relative; display: flex; flex-direction: row; min-height: 600px; max-height: 90vh;">
                <button id="close-preview-modal" style="position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.05); border: none; font-size: 1.5rem; cursor: pointer; color: #111; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; transition: background 0.2s;">&times;</button>
                <div style="flex: 1; background: #f8fafc; display: flex; flex-direction: column; align-items: center; padding: 2rem; overflow-y: auto;">
                    <img id="preview-image" src="" alt="Product" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); margin-bottom: 1.5rem;">
                    <div style="display: flex; gap: 1rem; width: 100%; justify-content: center;">
                        <img class="preview-thumb" src="" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid var(--brand-primary);">
                        <img class="preview-thumb" src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; opacity: 0.7;">
                        <img class="preview-thumb" src="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=200&q=80" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; opacity: 0.7;">
                    </div>
                </div>
                <div style="flex: 1.2; padding: 3rem 2.5rem; display: flex; flex-direction: column; overflow-y: auto;">
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; color: #fbbf24;">
                        <span id="preview-stars">⭐⭐⭐⭐⭐</span> <span id="preview-reviews" style="color: var(--text-muted); font-size: 0.9rem; font-weight: 500;">(128 Reviews)</span>
                    </div>
                    <h2 id="preview-title" style="font-size: 2rem; color: #111; margin-bottom: 0.5rem; line-height: 1.2;">Product Name</h2>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                            <div id="preview-price" style="font-size: 1.75rem; font-weight: 800; color: var(--brand-primary);">₹0.00</div>
                            <span id="preview-original-price" style="text-decoration: line-through; color: #94a3b8; font-size: 1.1rem; display: none;">₹0.00</span>
                        </div>
                        <span id="preview-discount" style="color: #dc2626; font-size: 0.9rem; font-weight: 700; background: #fee2e2; padding: 0.2rem 0.5rem; border-radius: 4px; display: none;">-0%</span>
                        <span id="preview-stock" style="background: #ecfdf5; color: var(--success); padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.85rem; font-weight: 700;">In Stock</span>
                    </div>
                    <p id="preview-desc" style="color: #475569; line-height: 1.6; margin-bottom: 1.5rem; font-size: 1.05rem;">High quality, fresh product delivered straight to your door in minutes. Enjoy the premium Swift Cart experience.</p>
                    <div style="margin-bottom: 2rem; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 1rem 0;">
                        <h4 style="font-size: 0.9rem; color: #111; margin-bottom: 0.5rem; text-transform: uppercase;">Highlights</h4>
                        <ul style="color: #475569; font-size: 0.95rem; margin-left: 1.2rem; line-height: 1.6;">
                            <li>Sourced directly from verified vendors</li>
                            <li>Temperature-controlled transit</li>
                            <li>Eligible for 20-minute rapid delivery</li>
                        </ul>
                    </div>
                    <div style="margin-bottom: 2rem;">
                        <h4 style="font-size: 1.1rem; color: #111; margin-bottom: 1rem;">Top Reviews</h4>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;"><strong style="font-size: 0.95rem;">Sarah M.</strong><span style="color: #fbbf24; font-size: 0.8rem;">⭐⭐⭐⭐⭐</span></div>
                                <p style="color: #475569; font-size: 0.9rem; line-height: 1.4;">"Absolutely amazing quality. Arrived fresh and exactly as described."</p>
                            </div>
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;"><strong style="font-size: 0.95rem;">David K.</strong><span style="color: #fbbf24; font-size: 0.8rem;">⭐⭐⭐⭐</span></div>
                                <p style="color: #475569; font-size: 0.9rem; line-height: 1.4;">"Great item and super fast 15-minute delivery."</p>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: auto; text-align: center; background: white; padding-top: 1rem; position: sticky; bottom: 0;">
                        <button id="preview-add-btn" class="btn checkout-btn" style="width: 100%; font-size: 1.1rem; padding: 1.25rem;">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', newModalHTML);
        previewModal = document.getElementById('preview-modal');
    }

    let closePreviewModal = document.getElementById('close-preview-modal');
    let previewImage = document.getElementById('preview-image');
    let previewTitle = document.getElementById('preview-title');
    let previewPrice = document.getElementById('preview-price');
    let previewAddBtn = document.getElementById('preview-add-btn');

    if(closePreviewModal) {
        closePreviewModal.addEventListener('click', () => {
            previewModal.classList.remove('active');
            setTimeout(() => previewModal.style.display = 'none', 300);
        });
    }

    function renderProducts(itemsToRender = inventory) {
        productGrid.innerHTML = '';
        const itemCountEl = document.getElementById('item-count');
        
        if(itemCountEl) {
            itemCountEl.textContent = `${itemsToRender.length} items`;
        }
        
        if(itemsToRender.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No items found.</p>';
            return;
        }

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer'; // Make it look clickable
            card.innerHTML = `
                <div class="product-image-container" style="position: relative;">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <div class="preview-overlay quick-view-btn" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; font-weight: 600; cursor: pointer;">
                        🔍 Quick View
                    </div>
                </div>
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <div class="stock-indicator">${item.stock_count} units available</div>
                    <div class="price-row">
                        <div class="product-price">₹${item.price.toFixed(2)}</div>
                        <button class="btn add-to-cart" data-id="${item.id}">Add</button>
                    </div>
                </div>
            `;
            
            // Open Preview Modal on image or quick view button click
            const triggerModal = () => {
                if(!previewModal) previewModal = document.getElementById('preview-modal');
                if(!previewImage) previewImage = document.getElementById('preview-image');
                if(!previewTitle) previewTitle = document.getElementById('preview-title');
                if(!previewPrice) previewPrice = document.getElementById('preview-price');
                if(!previewAddBtn) previewAddBtn = document.getElementById('preview-add-btn');
                
                previewImage.src = item.image;
                previewTitle.textContent = item.name;
                
                // Update first thumbnail to match main image
                const thumbs = document.querySelectorAll('.preview-thumb');
                if(thumbs && thumbs.length > 0) {
                    thumbs[0].src = item.image;
                    
                    // Make thumbnails interactive
                    thumbs.forEach(thumb => {
                        thumb.onclick = (e) => {
                            // Reset borders and opacity
                            thumbs.forEach(t => {
                                t.style.borderColor = 'transparent';
                                t.style.opacity = '0.7';
                            });
                            // Highlight selected
                            e.target.style.borderColor = 'var(--brand-primary)';
                            e.target.style.opacity = '1';
                            // Swap main image
                            previewImage.src = e.target.src;
                        };
                    });
                }
                
                // Random rating and reviews for realism
                const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
                const reviewCount = Math.floor(Math.random() * 500) + 12;
                const starsEl = document.getElementById('preview-stars');
                const reviewsEl = document.getElementById('preview-reviews');
                if(starsEl) starsEl.textContent = '⭐'.repeat(Math.round(rating));
                if(reviewsEl) reviewsEl.textContent = `(${rating} - ${reviewCount} Reviews)`;
                
                // Discount logic
                const discountOptions = [0, 0, 10, 15, 20]; // 60% chance of no discount
                const discountPct = discountOptions[Math.floor(Math.random() * discountOptions.length)];
                
                const originalPriceEl = document.getElementById('preview-original-price');
                const discountEl = document.getElementById('preview-discount');
                
                if (discountPct > 0 && originalPriceEl && discountEl) {
                    const originalPrice = item.price / (1 - (discountPct / 100));
                    previewPrice.textContent = `₹${item.price.toFixed(2)}`;
                    originalPriceEl.textContent = `₹${originalPrice.toFixed(2)}`;
                    originalPriceEl.style.display = 'inline';
                    discountEl.textContent = `-${discountPct}%`;
                    discountEl.style.display = 'inline';
                } else {
                    previewPrice.textContent = `₹${item.price.toFixed(2)}`;
                    if(originalPriceEl) originalPriceEl.style.display = 'none';
                    if(discountEl) discountEl.style.display = 'none';
                }
                
                // Overwrite the click listener on the preview modal's Add button
                previewAddBtn.onclick = () => {
                    addToCart(item.id);
                    previewAddBtn.textContent = 'Added';
                    setTimeout(() => {
                        previewAddBtn.textContent = 'Add to Cart';
                        previewModal.classList.remove('active');
                        setTimeout(() => previewModal.style.display = 'none', 300);
                    }, 1000);
                };
                
                previewModal.style.display = 'flex';
                // Small timeout to allow display: flex to apply before opacity transition
                setTimeout(() => previewModal.classList.add('active'), 10);
            };
            
            const imgContainer = card.querySelector('.product-image-container');
            if(imgContainer) {
                imgContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                    triggerModal();
                });
            }
            
            productGrid.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                addToCart(id);
                e.target.textContent = 'Added';
                setTimeout(() => e.target.textContent = 'Add', 1000);
            });
        });
    }

    // --- Cart & Drawer ---
    function addToCart(id) {
        const item = inventory.find(i => i.id === id);
        if(!item) return;
        
        const existing = cart.find(i => i.id === id);
        if(existing) {
            existing.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('velox_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        if(!cartCountEl) return;
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = total;
    }

    function renderCart() {
        if(!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: var(--text-muted);">Your cart is empty.</p>';
            cartTotalEl.textContent = '₹0.00';
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">Qty: ${item.quantity}</div>
                </div>
                <div>
                    <div style="margin-bottom: 0.5rem; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</div>
                    <button style="border: none; background: var(--danger); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;" onclick="window.removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
        
        cartTotalEl.textContent = `₹${total.toFixed(2)}`;
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        saveCart();
    };

    const stepCart = document.getElementById('step-cart');
    const stepDelivery = document.getElementById('step-delivery');
    const stepPayment = document.getElementById('step-payment');
    const drawerTitle = document.getElementById('drawer-title');
    const proceedDeliveryBtn = document.getElementById('proceed-delivery-btn');
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');

    function resetDrawerSteps() {
        if(stepCart && stepDelivery && stepPayment) {
            stepCart.style.display = 'flex';
            stepDelivery.style.display = 'none';
            stepPayment.style.display = 'none';
            if(drawerTitle) drawerTitle.textContent = 'Your Cart';
        }
    }

    if(proceedDeliveryBtn) {
        proceedDeliveryBtn.addEventListener('click', () => {
            if(cart.length === 0) return alert('Cart is empty');
            stepCart.style.display = 'none';
            stepDelivery.style.display = 'flex';
            drawerTitle.textContent = 'Delivery Details';
            
            // Auto-fill address if location was selected
            const locTextEl = document.getElementById('loc-text');
            const addressInput = document.getElementById('delivery-address');
            if(locTextEl && addressInput && locTextEl.textContent !== 'Select Location') {
                if(!addressInput.value) {
                    addressInput.value = locTextEl.textContent + ", ";
                }
            }
        });
    }

    if(proceedPaymentBtn) {
        proceedPaymentBtn.addEventListener('click', () => {
            const addressInput = document.getElementById('delivery-address');
            if(!addressInput.value.trim()) return alert('Please enter a delivery address');
            stepDelivery.style.display = 'none';
            stepPayment.style.display = 'flex';
            drawerTitle.textContent = 'Payment';
        });
    }

    function openDrawer() {
        if(!drawer) return;
        resetDrawerSteps();
        drawerOverlay.classList.add('active');
        drawer.classList.add('active');
        renderCart();
    }

    function closeDrawer() {
        if(!drawer) return;
        drawerOverlay.classList.remove('active');
        drawer.classList.remove('active');
    }

    cartBtns.forEach(btn => btn.addEventListener('click', openDrawer));
    if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if(cart.length === 0) return alert('Cart is empty');
            
            const rxVal = rxInput && rxInput.classList.contains('active') ? document.getElementById('prescription-id').value : null;
            
            const req = {
                category: currentCategory,
                items: cart,
                zip_code: '90210',
                prescription_id: rxVal
            };
            
            // Realistic Checkout Simulation
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = 'Processing Payment <span style="display:inline-block; animation: spin 1s linear infinite;">🔄</span>';
            
            setTimeout(async () => {
                checkoutBtn.innerHTML = 'Dispatching Order 🚀';
                
                const res = await window.api.dispatchOrder(req);
                
                if(res && res.status === 'dispatched') {
                    localStorage.setItem('velox_order', JSON.stringify(res));
                    cart = [];
                    saveCart();
                    window.location.href = 'track.html';
                } else {
                    alert('Checkout failed. Did you include a prescription ID for pharmacy items?');
                    checkoutBtn.textContent = 'Confirm & Dispatch';
                    checkoutBtn.disabled = false;
                }
            }, 1500); // 1.5s simulated payment delay
        });
    }

    // --- Support Chat ---
    const fab = document.getElementById('support-fab');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-msg-input');
    const sendBtn = document.getElementById('send-msg');

    if(fab && chatWindow) {
        fab.addEventListener('click', () => {
            chatWindow.classList.add('active');
            const badge = fab.querySelector('.badge');
            if(badge) badge.style.display = 'none';
        });

        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        const appendMsg = (text, type) => {
            const div = document.createElement('div');
            div.className = `msg ${type}`;
            div.textContent = text;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        sendBtn.addEventListener('click', async () => {
            const val = chatInput.value.trim();
            if(!val) return;
            
            appendMsg(val, 'user');
            chatInput.value = '';
            
            const orderData = JSON.parse(localStorage.getItem('velox_order'));
            const orderId = orderData ? orderData.tracking_uuid : null;
            
            const res = await window.api.sendSupportMessage(val, orderId);
            if(res && res.response) {
                appendMsg(res.response, 'bot');
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendBtn.click();
        });
    }

    // --- Tracking Page Logic ---
    const progressFill = document.getElementById('progress-fill');
    const statusText = document.getElementById('status-text');
    const etaDisplay = document.getElementById('eta-display');
    const trackingContainer = document.getElementById('tracking-container');

    const deliveryQuotes = [
        "Packing your items with care...",
        "Courier is on the move! 🛵",
        "Zooming through the streets...",
        "Almost at your door! 🏠",
        "Arriving in just a moment!"
    ];

    if(progressFill && statusText && trackingContainer) {
        const orderData = JSON.parse(localStorage.getItem('velox_order'));
        if(!orderData) {
            statusText.textContent = "No active orders.";
            etaDisplay.textContent = "--";
        } else {
            let minsLeft = orderData.delivery_estimate_minutes;
            let totalMins = minsLeft;
            let quoteIndex = 0;
            
            etaDisplay.textContent = `~${minsLeft} mins`;
            
            // Fast simulation timer (1s = 1min for demo)
            const timer = setInterval(() => {
                minsLeft--;
                if(minsLeft <= 0) {
                    clearInterval(timer);
                    // Grand Finale Screen
                    trackingContainer.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉📦</div>
                            <h2 style="color: var(--brand-primary); font-size: 2rem; margin-bottom: 1rem;">Delivered!</h2>
                            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">Thanks for choosing Swift Cart. Your order has safely arrived.</p>
                            <button onclick="window.location.href='index.html'" class="btn checkout-btn" style="width: 100%;">Return to Home</button>
                        </div>
                    `;
                    localStorage.removeItem('velox_order'); // Session clear
                } else {
                    const pct = ((totalMins - minsLeft) / totalMins) * 100;
                    progressFill.style.width = `${pct}%`;
                    etaDisplay.textContent = `~${minsLeft} mins`;
                    
                    // Rotate Quotes
                    statusText.textContent = deliveryQuotes[quoteIndex % deliveryQuotes.length];
                    quoteIndex++;
                }
            }, 2000); // 2 real seconds = 1 simulated minute
        }
    }
});
