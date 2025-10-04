  
        // Initialize animations
        AOS.init({
            duration: 1000,
            once: true
        });
        
        // Initialize feather icons
        feather.replace();
        
        // Cart functionality
        let cartQuantity = 0;
        
        function addToCart() {
            cartQuantity++;
            document.getElementById('cartCount').textContent = cartQuantity;
            
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000);
        }
        

// Favour's Farm Cart Management System
(function() {
    'use strict';
    
    // Cart management object
    const FarmCart = {
        // Get cart from localStorage
        getCart: function() {
            try {
                return JSON.parse(localStorage.getItem('favoursFarmCart')) || [];
            } catch (e) {
                return [];
            }
        },
        
        // Save cart to localStorage
        saveCart: function(cart) {
            try {
                localStorage.setItem('favoursFarmCart', JSON.stringify(cart));
            } catch (e) {
                console.error('Failed to save cart:', e);
            }
        },
        
        // Add item to cart
        addItem: function(product) {
            let cart = this.getCart();
            const existingItem = cart.find(item => item.name === product.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1,
                    id: Date.now() + Math.random()
                });
            }
            
            this.saveCart(cart);
            this.updateCartCount();
            this.showAddedNotification(product.name);
        },
        
        // Remove item from cart
        removeItem: function(itemId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== itemId);
            this.saveCart(cart);
            this.updateCartCount();
            this.updateCartPage();
        },
        
        // Update item quantity
        updateQuantity: function(itemId, newQuantity) {
            let cart = this.getCart();
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (newQuantity <= 0) {
                    this.removeItem(itemId);
                } else {
                    item.quantity = newQuantity;
                    this.saveCart(cart);
                    this.updateCartCount();
                    this.updateCartPage();
                }
            }
        },
        
        // Update cart count display
        updateCartCount: function() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            // Update cart count in navigation
            const cartElements = document.querySelectorAll('[href*="cart"], [onclick*="cart"]');
            cartElements.forEach(element => {
                const textContent = element.textContent;
                if (textContent.includes('Cart') || textContent.includes('0')) {
                    element.textContent = textContent.replace(/\d+/, totalItems.toString());
                }
            });
            
            // Also update any standalone cart count
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = totalItems;
            });
        },
        
        // Show notification when item is added
        showAddedNotification: function(productName) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10B981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span><strong>${productName}</strong> added to cart!</span>
                </div>
            `;
            
            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                }, 300);
            }, 3000);
        },
        
 // Enhanced parse product information from page
        parseProductInfo: function(button) {
            var productContainer = button.parentNode;
            var productName = '';
            var productPrice = 0;
            var priceText = '';
            var unit = '';
            
            // First, look for h3 tag specifically for product name
            var currentElement = productContainer;
            for (var level = 0; level < 4; level++) {
                if (!currentElement) break;
                
                // Look for h3 elements in current container
                var h3Elements = currentElement.querySelectorAll('h3');
                for (var h = 0; h < h3Elements.length; h++) {
                    var h3Text = h3Elements[h].textContent.trim();
                    if (h3Text && h3Text.indexOf('Add to Cart') === -1 && h3Text.length > 2) {
                        productName = h3Text;
                        break;
                    }
                }
                
                // If we found a name in h3, break out of the level loop
                if (productName) break;
                
                // Move up one level
                currentElement = currentElement.parentElement;
            }
            
            // Now look for price in P tags specifically
            currentElement = productContainer;
            for (var level2 = 0; level2 < 4; level2++) {
                if (!currentElement) break;
                
                // Look for p elements that contain price
                var pElements = currentElement.querySelectorAll('p');
                for (var p = 0; p < pElements.length; p++) {
                    var pText = pElements[p].textContent.trim();
                    var priceMatch = pText.match(/₦([\d,]+)\s*\[([^\]]+)\]/);
                    
                    if (priceMatch) {
                        productPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
                        priceText = pText;
                        
                        // Extract unit from the price text
                        var unitMatch = pText.match(/\[(PER\s+[^\]]+)\]/i);
                        if (unitMatch) {
                            unit = unitMatch[1].toLowerCase();
                        } else {
                            // Fallback: look for "per" in the text
                            var perMatch = pText.match(/(per\s+\w+)/i);
                            if (perMatch) {
                                unit = perMatch[1].toLowerCase();
                            } else {
                                unit = 'per item';
                            }
                        }
                        break;
                    }
                    
                    // Alternative pattern: ₦24,970 [PER BAG]
                    var altMatch = pText.match(/₦([\d,]+)/);
                    if (altMatch && pText.toLowerCase().indexOf('per') !== -1) {
                        productPrice = parseInt(altMatch[1].replace(/,/g, ''), 10);
                        priceText = pText;
                        
                        if (pText.toLowerCase().indexOf('per bag') !== -1) {
                            unit = 'per bag';
                        } else if (pText.toLowerCase().indexOf('per kg') !== -1) {
                            unit = 'per kg';
                        } else {
                            var perMatch2 = pText.match(/(per\s+\w+)/i);
                            unit = perMatch2 ? perMatch2[1].toLowerCase() : 'per item';
                        }
                        break;
                    }
                }
                
                if (productPrice > 0) break;
                
                // Move up one level
                currentElement = currentElement.parentElement;
            }
            
            // Fallback: if no h3 found, look for any text that could be a product name
            if (!productName) {
                currentElement = productContainer;
                for (var fallback = 0; fallback < 3; fallback++) {
                    if (!currentElement) break;
                    
                    var siblings = currentElement.parentElement ? currentElement.parentElement.children : [];
                    for (var i = 0; i < siblings.length; i++) {
                        var sibling = siblings[i];
                        var text = sibling.textContent.trim();
                        
                        // Look for product name (text without price and not "Add to Cart")
                        if (text && text.indexOf('₦') === -1 && text.indexOf('Add to Cart') === -1 && text.length > 3) {
                            // Skip if it looks like navigation or common elements
                            if (text.indexOf('Home') === -1 && text.indexOf('Cart') === -1 && text.indexOf('Login') === -1) {
                                productName = text;
                                break;
                            }
                        }
                    }
                    
                    if (productName) break;
                    currentElement = currentElement.parentElement;
                }
            }
            
            return {
                name: productName || 'Unknown Product',
                price: productPrice || 0,
                priceText: priceText || '',
                unit: unit || 'per item'
            };
        },
        
        
        // Update cart page content
        updateCartPage: function() {
            // Only run on cart page
            if (!window.location.href.includes('cart') && !document.title.includes('Cart')) {
                return;
            }
            
            const cart = this.getCart();
            const shippingFeePerBag = 600;
            
            // Find cart container
            let cartContainer = document.querySelector('.cart-items');
            if (!cartContainer) {
                // Create cart container if it doesn't exist
                const cartSection = document.querySelector('body');
                cartContainer = document.createElement('div');
                cartContainer.className = 'cart-items';
                
                // Insert after "Your Shopping Cart" heading
                const headings = document.querySelectorAll('h1, h2, h3');
                let insertPoint = null;
                for (let heading of headings) {
                    if (heading.textContent.includes('Cart') || heading.textContent.includes('Total')) {
                        insertPoint = heading.nextElementSibling || heading;
                        break;
                    }
                }
                
                if (insertPoint) {
                    insertPoint.parentNode.insertBefore(cartContainer, insertPoint.nextSibling);
                } else {
                    cartSection.appendChild(cartContainer);
                }
            }
            
            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalBags = cart.reduce((sum, item) => sum + item.quantity, 0);
            const shippingFee = totalBags * shippingFeePerBag;
            const grandTotal = subtotal + shippingFee;
            
            // Generate cart HTML
            var cartHTML = '';
            
            // Start container
            cartHTML += '<div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">';
            cartHTML += '<h3 style="margin-bottom: 15px; color: #333; font-size: 18px; font-weight: bold;">Cart Items</h3>';
            
            if (cart.length === 0) {
                cartHTML += '<p style="color: #666; text-align: center; padding: 20px;">Your cart is empty</p>';
            } else {
                // Add each cart item
                for (var i = 0; i < cart.length; i++) {
                    var item = cart[i];
                    cartHTML += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">';
                    
                    // Product info
                    cartHTML += '<div style="flex: 1;">';
                    cartHTML += '<h4 style="margin: 0; color: #333; font-weight: bold;">' + item.name + '</h4>';
                    cartHTML += '<p style="margin: 5px 0; color: #666;">₦' + item.price.toLocaleString() + ' ' + (item.unit || 'per bag') + '</p>';
                    cartHTML += '</div>';
                    
                    // Quantity controls
                    cartHTML += '<div style="display: flex; align-items: center; gap: 10px;">';
                    cartHTML += '<button onclick="FarmCart.updateQuantity(' + item.id + ', ' + (item.quantity - 1) + ')" ';
                    cartHTML += 'style="width: 30px; height: 30px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; border-radius: 4px;">-</button>';
                    cartHTML += '<span style="min-width: 20px; text-align: center; font-weight: bold;">' + item.quantity + '</span>';
                    cartHTML += '<button onclick="FarmCart.updateQuantity(' + item.id + ', ' + (item.quantity + 1) + ')" ';
                    cartHTML += 'style="width: 30px; height: 30px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; border-radius: 4px;">+</button>';
                    cartHTML += '<button onclick="FarmCart.removeItem(' + item.id + ')" ';
                    cartHTML += 'style="margin-left: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Remove</button>';
                    cartHTML += '</div>';
                    
                    // Item total
                    cartHTML += '<div style="min-width: 100px; text-align: right; font-weight: bold;">';
                    cartHTML += '₦' + (item.price * item.quantity).toLocaleString();
                    cartHTML += '</div>';
                    
                    cartHTML += '</div>';
                }
                
                // Add totals section
                cartHTML += '<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #ddd;">';
                cartHTML += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
                cartHTML += '<span>Subtotal:</span>';
                cartHTML += '<span style="font-weight: bold;">₦' + subtotal.toLocaleString() + '</span>';
                cartHTML += '</div>';
                cartHTML += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
                cartHTML += '<span>Shipping (' + totalBags + ' bags × ₦600):</span>';
                cartHTML += '<span style="font-weight: bold;">₦' + shippingFee.toLocaleString() + '</span>';
                cartHTML += '</div>';
                cartHTML += '<div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 18px;">';
                cartHTML += '<span style="font-weight: bold;">Grand Total:</span>';
                cartHTML += '<span style="font-weight: bold; color: #28a745;">₦' + grandTotal.toLocaleString() + '</span>';
                cartHTML += '</div>';
                cartHTML += '</div>';
            }
            
            cartHTML += '</div>';
            
            cartContainer.innerHTML = cartHTML;
            
            // Update total display if it exists
            const totalElements = document.querySelectorAll('[textContent*="Total"], [innerHTML*="Total"]');
            totalElements.forEach(element => {
                if (element.textContent.includes('₦')) {
                    element.textContent = element.textContent.replace(/₦[\d,\.]+/, `₦${grandTotal.toLocaleString()}.00`);
                }
            });
        },
        
        // Initialize cart system
        init: function() {
            // Update cart count on page load
            this.updateCartCount();
            
            // Add event listeners to "Add to Cart" buttons
            var self = this;
            document.addEventListener('click', function(e) {
                var button = e.target;
                
                // Check if clicked element is an "Add to Cart" button
                if (button.textContent && button.textContent.trim() === 'Add to Cart') {
                    e.preventDefault();
                    
                    var productInfo = self.parseProductInfo(button);
                    if (productInfo.price > 0) {
                        self.addItem(productInfo);
                    } else {
                        // Create custom alert instead of using alert()
                        self.showCustomAlert('Unable to determine product price. Please try again.');
                    }
                }
            });
            
            // Update cart page if we're on the cart page
            if (window.location.href.includes('cart') || document.title.includes('Cart')) {
                // Wait a bit for page to fully load
                var self = this;
                setTimeout(function() {
                    self.updateCartPage();
                }, 100);
            }
        },
        
        // Show custom alert dialog
        showCustomAlert: function(message) {
            var modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
            
            var alertBox = document.createElement('div');
            alertBox.style.cssText = 'background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 400px; margin: 20px;';
            
            alertBox.innerHTML = '<p style="margin: 0 0 15px 0; color: #333;">' + message + '</p>' +
                                '<button onclick="this.closest(\'div[style*=\"position: fixed\"]\').remove()" style="background: #5D5CDE; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">OK</button>';
            
            modal.appendChild(alertBox);
            document.body.appendChild(modal);
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            FarmCart.init();
        });
    } else {
        FarmCart.init();
    }
    
    // Make FarmCart globally available for onclick handlers
    window.FarmCart = FarmCart;
    
})();

        // Dark mode support
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
