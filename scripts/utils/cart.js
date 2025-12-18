// Enhanced Cart Management System with Discount & Coupon Support

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.coupons = {
      'SAVE10': { type: 'percentage', value: 10, minOrder: 500, description: '10% off on orders above ₹500' },
      'FLAT50': { type: 'fixed', value: 50, minOrder: 300, description: '₹50 off on orders above ₹300' },
      'WELCOME20': { type: 'percentage', value: 20, minOrder: 1000, description: '20% off on orders above ₹1000' },
      'FREESHIP': { type: 'free_shipping', value: 0, minOrder: 1, description: 'Free shipping on any order' },
      'NEWBIE15': { type: 'percentage', value: 15, minOrder: 799, description: '15% off for new customers' }
    };
    this.shippingRate = 99;
    this.freeShippingThreshold = 699;
    this.appliedCoupon = null;
    
    this.init();
  }

  init() {
    this.updateCartDisplay();
    this.setupEventListeners();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartDisplay();
    this.updateCartBadge();
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart();
    this.showNotification(`${product.name} added to cart!`, 'success');
    return true;
  }

  removeFromCart(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const removedItem = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.saveCart();
      this.showNotification(`${removedItem.name} removed from cart`, 'info');
      return true;
    }
    return false;
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
      return true;
    }
    return false;
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateShipping(subtotal) {
    if (this.appliedCoupon && this.coupons[this.appliedCoupon]?.type === 'free_shipping') {
      return 0;
    }
    return subtotal >= this.freeShippingThreshold ? 0 : this.shippingRate;
  }

  calculateDiscount(subtotal) {
    if (!this.appliedCoupon || !this.coupons[this.appliedCoupon]) {
      return 0;
    }

    const coupon = this.coupons[this.appliedCoupon];
    
    if (subtotal < coupon.minOrder) {
      return 0;
    }

    switch (coupon.type) {
      case 'percentage':
        return Math.floor(subtotal * coupon.value / 100);
      case 'fixed':
        return Math.min(coupon.value, subtotal);
      case 'free_shipping':
        return this.shippingRate; // Return shipping amount as discount
      default:
        return 0;
    }
  }

  applyCoupon(couponCode) {
    const code = couponCode.toUpperCase();
    const coupon = this.coupons[code];
    const subtotal = this.getCartTotal();

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    if (subtotal < coupon.minOrder) {
      return { 
        success: false, 
        message: `Minimum order of ₹${coupon.minOrder} required for this coupon` 
      };
    }

    if (this.appliedCoupon === code) {
      return { success: false, message: 'Coupon already applied' };
    }

    this.appliedCoupon = code;
    localStorage.setItem('appliedCoupon', code);
    
    return { 
      success: true, 
      message: `Coupon applied! ${coupon.description}`,
      discount: this.calculateDiscount(subtotal)
    };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem('appliedCoupon');
    this.updateCartDisplay();
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
    this.updateCartDisplay();
    this.updateCartBadge();
  }

  updateCartDisplay() {
    // Update cart count in navigation
    this.updateCartBadge();
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
      this.renderCartPage();
    }
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge, [data-id="cart-badge"]');
    const count = this.getCartCount();
    
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
    });
  }

  renderCartPage() {
    const cartContainer = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-summary');
    
    if (!cartContainer) return;

    if (this.cart.length === 0) {
      cartContainer.innerHTML = this.renderEmptyCart();
      if (summaryContainer) summaryContainer.innerHTML = '';
      return;
    }

    cartContainer.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
    
    if (summaryContainer) {
      summaryContainer.innerHTML = this.renderCartSummary();
    }

    this.attachCartEventListeners();
  }

  renderCartItem(item) {
    return `
      <div class="cart-item bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-4" data-item-id="${item.id}">
        <div class="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-lg">
        </div>
        
        <div class="flex-1 space-y-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">${item.name}</h3>
            <p class="text-gray-600">${item.category || 'Handmade'}</p>
            <p class="text-2xl font-bold text-deep-rose mt-2">₹${item.price}</p>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700">Quantity:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button class="quantity-btn px-3 py-1 hover:bg-gray-100 transition-colors" data-action="decrease" data-id="${item.id}">-</button>
                <span class="px-4 py-1 border-l border-r border-gray-300 min-w-[3rem] text-center">${item.quantity}</span>
                <button class="quantity-btn px-3 py-1 hover:bg-gray-100 transition-colors" data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <span class="text-lg font-semibold">₹${item.price * item.quantity}</span>
              <button class="remove-btn text-red-500 hover:text-red-700 p-2" data-id="${item.id}" title="Remove item">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCartSummary() {
    const subtotal = this.getCartTotal();
    const shipping = this.calculateShipping(subtotal);
    const discount = this.calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;

    return `
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
        
        <!-- Coupon Section -->
        <div class="mb-6 p-4 bg-sage/10 rounded-lg">
          <div class="flex gap-2 mb-2">
            <input type="text" id="coupon-input" placeholder="Enter coupon code" 
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                   value="${this.appliedCoupon || ''}">
            <button id="apply-coupon-btn" 
                    class="px-4 py-2 bg-deep-rose text-white rounded-lg text-sm font-medium hover:bg-deep-rose/90 transition-colors">
              ${this.appliedCoupon ? 'Remove' : 'Apply'}
            </button>
          </div>
          <div id="coupon-message" class="text-sm"></div>
          ${this.appliedCoupon ? `<div class="text-sm text-green-600 mt-1">✓ ${this.coupons[this.appliedCoupon].description}</div>` : ''}
        </div>

        <!-- Price Breakdown -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal (${this.getCartCount()} items)</span>
            <span class="font-medium">₹${subtotal}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-600">Shipping</span>
            <span class="font-medium ${shipping === 0 ? 'text-green-600' : ''}">
              ${shipping === 0 ? 'Free!' : '₹' + shipping}
            </span>
          </div>
          
          ${discount > 0 ? `
            <div class="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹${discount}</span>
            </div>
          ` : ''}
          
          ${subtotal < this.freeShippingThreshold ? `
            <div class="text-sm text-gray-500 bg-yellow-50 p-2 rounded">
              <i data-lucide="truck" class="w-4 h-4 inline mr-1"></i>
              Add ₹${this.freeShippingThreshold - subtotal} more for free shipping!
            </div>
          ` : ''}
          
          <hr class="my-4">
          
          <div class="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span class="text-deep-rose">₹${total}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <a href="checkout.html" 
             class="block w-full bg-gradient-to-r from-rose-gold to-deep-rose text-white py-4 px-6 rounded-lg font-semibold text-lg text-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            Proceed to Checkout
          </a>
          
          <a href="shop.html" 
             class="block w-full bg-white border-2 border-deep-rose text-deep-rose py-3 px-6 rounded-lg font-semibold text-center hover:bg-deep-rose hover:text-white transition-all duration-300">
            Continue Shopping
          </a>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-center space-x-6 text-sm text-gray-500">
            <div class="flex items-center">
              <i data-lucide="shield-check" class="w-4 h-4 mr-1"></i>
              Secure Payment
            </div>
            <div class="flex items-center">
              <i data-lucide="truck" class="w-4 h-4 mr-1"></i>
              Fast Delivery
            </div>
            <div class="flex items-center">
              <i data-lucide="rotate-ccw" class="w-4 h-4 mr-1"></i>
              Easy Returns
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEmptyCart() {
    return `
      <div class="text-center py-16">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-400"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any beautiful handmade items to your cart yet.
        </p>
        <a href="shop.html" 
           class="inline-block bg-gradient-to-r from-rose-gold to-deep-rose text-white py-3 px-8 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
          Start Shopping
        </a>
      </div>
    `;
  }

  attachCartEventListeners() {
    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const itemId = parseInt(e.target.dataset.id);
        const item = this.cart.find(item => item.id === itemId);
        
        if (item) {
          const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(itemId, newQuantity);
        }
      });
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.closest('.remove-btn').dataset.id);
        this.removeFromCart(itemId);
      });
    });

    // Coupon functionality
    const couponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    
    if (couponBtn) {
      couponBtn.addEventListener('click', () => {
        if (this.appliedCoupon) {
          this.removeCoupon();
        } else {
          const code = couponInput.value.trim();
          if (code) {
            const result = this.applyCoupon(code);
            this.showCouponMessage(result.message, result.success ? 'success' : 'error');
            if (result.success) {
              this.renderCartPage(); // Re-render to show updated totals
            }
          }
        }
      });
    }

    // Re-initialize Lucide icons for new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  showCouponMessage(message, type) {
    const messageEl = document.getElementById('coupon-message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `text-sm ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
      
      if (type === 'error') {
        setTimeout(() => {
          messageEl.textContent = '';
        }, 3000);
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  setupEventListeners() {
    // Load applied coupon on page load
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon && this.coupons[savedCoupon]) {
      this.appliedCoupon = savedCoupon;
    }

    // Listen for storage changes (cart updates from other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.cart = this.loadCart();
        this.updateCartDisplay();
      }
    });
  }
}

// Export for use in other scripts
window.CartManager = CartManager;

// Initialize cart manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
  });
} else {
  window.cartManager = new CartManager();
}

export { CartManager };