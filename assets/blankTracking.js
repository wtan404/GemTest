/**
 * Centralized Event Tracking Bridge
 * Maps internal theme events to external marketing pixels
 */

window.TrackingBridge = {
  // Define our mapping of theme events to tracking functions
  
  init(serverData = {}) {
    // Fire global page view
    if (typeof rdt !== 'undefined') rdt('track', 'PageVisit');
    
    // Fire specific product view
    if (serverData.pageType === 'product' && serverData.productData) {
      this.trackViewContent(serverData.productData);
    }
    
    this.bindEvents();
  },
  bindEvents() {
    // Standardize event handling
    document.addEventListener('shapes:cart:afteradditem', () => this.trackAddToCart());
    document.addEventListener('bb:design:saved', (e) => this.trackDesignSaved(e.detail));
  },

  trackAddToCart() {
    if (typeof rdt !== 'undefined') rdt('track', 'AddToCart');
  },

  trackViewContent(product) {
    if (typeof rdt !== 'undefined') rdt('track', 'ViewContent', { products: [product] });
  },

  trackDesignSaved(data) {
    if (typeof rdt !== 'undefined') {
      rdt('track', 'CustomDesignSaved', {
        product_id: data.productId,
        design_id: data.designId
      });
    }
  }


};

document.addEventListener('DOMContentLoaded', () => window.TrackingBridge.init());