/**
 * Centralized Event Tracking Bridge
 * Maps internal theme events to external marketing pixels
 */

window.TrackingBridge = {
  // Define our mapping of theme events to tracking functions
  init() {
    this.bindEvents();
    console.log('Tracking Bridge Initialized');
  },

  bindEvents() {
    // Standardize event handling
    document.addEventListener('shapes:cart:afteradditem', () => this.trackAddToCart());
    document.addEventListener('bb:design:saved', (e) => this.trackDesignSaved(e.detail));
  },

  trackAddToCart() {
    // Reddit Pixel
    if (typeof rdt !== 'undefined') {
      rdt('track', 'AddToCart');
    }
    // Add additional pixels here (e.g., Meta, TikTok)
    console.log('Tracking: AddToCart fired');
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