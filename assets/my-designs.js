/**
 * My Designs Web Component
 * Displays and manages saved custom bottle designs from Swym wishlist.
 *
 * Handles multiple "My Designs" lists to work around Swym's limitation
 * of only allowing one item per variant per list.
 */

class MyDesignsComponent extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.designs = [];
  }

  connectedCallback() {
    this.render();
    this.loadDesigns();
  }

  render() {
    this.innerHTML = `
      <div class="my-designs-container">
        <div id="loading-state" class="text-center py-8 hidden">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2 text-gray-600">Loading your designs...</p>
        </div>
        <div id="empty-state" class="text-center py-8 text-gray-600 hidden">
          <p>You haven't saved any designs yet.</p>
          <p class="mt-2">Create your first custom bottle design to see it here!</p>
        </div>

        <div id="error-state" class="text-center py-8 text-red-600 hidden">
          <p>Failed to load your designs. Please try again later.</p>
        </div>

        <div id="designs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
          <!-- Design cards will be inserted here -->
        </div>
      </div>
    `;
  }

  async loadDesigns() {
    try {
      this.setLoadingState(true);

      // Wait for Swym API to be available
      await this.waitForSwym();

      // Get all wishlist lists
      const lists = await this.getSwymLists();

      // Find the "My Designs" lists (plural - can be multiple)
      const myDesignsLists = this.findMyDesignsList(lists);

      if (!myDesignsLists || myDesignsLists.length === 0) {
        this.showEmptyState();
        return;
      }

      // Get list items (designs) from all My Designs lists
      const allDesigns = await this.getAllDesignsFromLists(myDesignsLists);

      if (!allDesigns || allDesigns.length === 0) {
        this.showEmptyState();
        return;
      }

      this.designs = allDesigns;
      this.renderDesigns();

    } catch (error) {
      console.error('Failed to load designs:', error);
      this.showErrorState();
    } finally {
      this.setLoadingState(false);
    }
  }

  async waitForSwym(timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkSwym = () => {
        if (window._swat) {
          return resolve(window._swat);
        }

        if (Date.now() - startTime > timeoutMs) {
          return reject(new Error('Swym wishlist service not available'));
        }

        setTimeout(checkSwym, 250);
      };

      checkSwym();
    });
  }

  async getSwymLists() {
    const api = window._swat;
    return new Promise((resolve, reject) => {
      if (!api.fetchLists) {
        reject(new Error('fetchLists API method not available'));
        return;
      }

      api.fetchLists({
        callbackFn: (result) => {
          // Handle different response structures from Swym API
          let lists = [];
          if (result) {
            if (Array.isArray(result)) {
              lists = result; // Direct array response
            } else if (result.lists && Array.isArray(result.lists)) {
              lists = result.lists; // Nested in 'lists' property
            } else if (result.data && Array.isArray(result.data)) {
              lists = result.data; // Nested in 'data' property
            }
          }
          resolve(lists);
        },
        errorFn: (error) => {
          console.error('fetchLists error:', error);
          reject(new Error(`Failed to fetch lists: ${error?.message || error}`));
        }
      });
    });
  }

  findMyDesignsList(lists) {
    // Find ALL lists with "My Designs" properties, not just one
    return lists.filter(list => {
      // Check by list name (including numbered variations)
      if (list?.lname === 'My Designs' || list?.lname?.startsWith('My Designs ')) {
        return true;
      }
      // Check by custom attributes (lprops)
      if (list?.lprops) {
        const attr = list.lprops['my-designs'];
        return attr === 'true' || attr === true || attr === '1';
      }
      return false;
    });
  }

  async getAllDesignsFromLists(designsLists) {
    const allDesigns = [];
    // Get designs from each "My Designs" list
    for (const list of designsLists) {
      try {
        const designs = await this.getListItems(list);
        if (designs && designs.length > 0) {
          // Add the list ID to each design so we know which list to delete from later
          const designsWithListId = designs.map(design => ({
            ...design,
            _listId: list.lid // Store the list ID for deletion purposes
          }));
          allDesigns.push(...designsWithListId);
        }
      } catch (error) {
        console.warn(`Failed to get designs from list ${list.lid}:`, error);
        // Continue with other lists even if one fails
      }
    }
    // Sort designs by creation date (newest first) if available
    allDesigns.sort((a, b) => {
      const dateA = a.cprops?.['created-date'] ? new Date(a.cprops['created-date']) : new Date(0);
      const dateB = b.cprops?.['created-date'] ? new Date(b.cprops['created-date']) : new Date(0);
      return dateB - dateA;
    });
    return allDesigns;
  }

  async getListItems(list) {
    // Try to get items from the list directly first
    if (Array.isArray(list.d) && list.d.length > 0) {
      return list.d;
    }

    // If no items in the list object, fetch detailed list contents
    try {
      const details = await this.getListDetails(list.lid);

      // Handle the actual response structure from fetchListDetails
      if (details?.items && Array.isArray(details.items)) {
        return details.items;
      }
      // Fallback: try list.listcontents if items array is not available
      if (details?.list?.listcontents && Array.isArray(details.list.listcontents)) {
        return details.list.listcontents;
      }
      // Legacy fallback for other possible structures
      return details?.d || [];
    } catch (error) {
      console.warn('Failed to fetch detailed list contents:', error);
      return [];
    }
  }

  async getListDetails(listId) {
    const api = window._swat;
    return new Promise((resolve, reject) => {
      // Try fetchListDetails first with correct parameter format
      if (api.fetchListDetails) {
        const listConfig = { lid: listId };

        api.fetchListDetails(listConfig, (result) => {
          resolve(result);
        }, (error) => {
          console.error('fetchListDetails error:', error);
          reject(error);
        });
      } else if (api.fetchListContents) {
        // Fallback to fetchListContents (if it uses different parameter format)
        api.fetchListContents(listId, (result) => {
          resolve(result);
        }, (error) => {
          console.error('fetchListContents error:', error);
          reject(error);
        });
      } else {
        reject(new Error('List details API not available'));
      }
    });
  }

  renderDesigns() {
    const grid = this.querySelector('#designs-grid');
    if (!grid) return;

    grid.innerHTML = '';

    this.designs.forEach((design, index) => {
      const card = this.createDesignCard(design, index);
      grid.appendChild(card);
    });
    this.showDesignsGrid();
  }

  createDesignCard(design, index) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow';
    // Extract design data
    const imageUrl = this.getDesignImageUrl(design);
    const title = this.getDesignTitle(design, index);
    const subtitle = this.getDesignSubtitle(design);

    card.innerHTML = `
      <div class="relative aspect-square bg-gray-100">
        <img
          src="${imageUrl}"
          alt="${title}"
          class="w-full h-full object-cover"
          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlc2lnbjwvdGV4dD48L3N2Zz4='"
        >

        <!-- Delete button - top right corner -->
        <button
          class="delete-btn absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-black rounded-full flex items-center justify-center transition-colors shadow-md"
          data-design-index="${index}"
          title="Delete design"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="p-4">
        <h3 class="font-medium text-gray-900 mb-1">${title}</h3>
        ${subtitle ? `<p class="text-sm text-gray-500 mb-4">${subtitle}</p>` : '<div class="mb-4"></div>'}

        <!-- Quantity selector -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Quantity</label>
          <div class="flex flex-nowrap items-center justify-start">
            <button
              type="button"
              class="quantity-btn-minus push-btn"
              aria-label="&minus;"
              data-action="decrement"
            >
              <div class="push-btn__svg w-10 h-10">
                <svg class="theme-icon" width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path fill="#fff" stroke="currentColor" stroke-width="2" d="M20 1c10.493 0 19 8.507 19 19s-8.507 19-19 19S1 30.493 1 20 9.507 1 20 1Z"/>
                  <path stroke="currentColor" stroke-width="3" d="M14 20.157h12.313"/>
                </svg>
              </div>
            </button>
            <input
              type="number"
              class="quantity-input input--no-border block max-w-[3rem] appearance-none border-0 bg-transparent p-2 text-center text-md text-scheme-text"
              value="${this.getMinQuantity()}"
              min="${this.getMinQuantity()}"
              step="1"
            >
            <button
              type="button"
              class="quantity-btn-plus push-btn"
              aria-label="&plus;"
              data-action="increment"
            >
              <div class="push-btn__svg w-10 h-10">
                <svg class="theme-icon" width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path fill="#fff" stroke="currentColor" stroke-width="2" d="M20 1c10.493 0 19 8.507 19 19s-8.507 19-19 19S1 30.493 1 20 9.507 1 20 1Z"/>
                  <path stroke="currentColor" stroke-width="3" d="M14 20.157h12.313M19.948 26.314V14"/>
                </svg>
              </div>
            </button>
          </div>
          <div class="text-xs text-gray-500 mt-1">Minimum: ${this.getMinQuantity()}</div>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="edit-design-btn push-btn push-btn--pop flex-1"
            data-design-index="${index}"
          >
            <span class="push-btn__surface w-full">
              Edit Design
            </span>
          </button>

          <button
            type="button"
            class="add-to-cart-btn push-btn push-btn--pop flex-1"
            data-design-index="${index}"
          >
            <span class="push-btn__surface w-full">
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    `;    // Add event listener for "Edit Design" button
    const editDesignBtn = card.querySelector('.edit-design-btn');
    editDesignBtn.addEventListener('click', () => this.handleEditDesign(design, editDesignBtn));

    // Add event listener for "Add to Cart" button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => this.handleAddToCart(design, addToCartBtn));

    // Add event listener for "Delete" button
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => this.handleDeleteDesign(design, deleteBtn, index));

    // Add event listeners for quantity buttons
    const quantityInput = card.querySelector('.quantity-input');
    const decrementBtn = card.querySelector('.quantity-btn-minus');
    const incrementBtn = card.querySelector('.quantity-btn-plus');
    decrementBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || this.getMinQuantity();
      const minValue = this.getMinQuantity();
      if (currentValue > minValue) {
        quantityInput.value = currentValue - 1;
      }
    });
    incrementBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || this.getMinQuantity();
      quantityInput.value = currentValue + 1;
    });
    quantityInput.addEventListener('input', () => {
      const value = parseInt(quantityInput.value);
      const minValue = this.getMinQuantity();
      if (isNaN(value) || value < minValue) {
        quantityInput.value = minValue;
      }
    });
    return card;
  }

  getMinQuantity() {
    // Get minimum quantity from shop metafield, fallback to 1
    // This should match the shop.metafields.custom.custom_bottle_minimum value
    // For now, we'll use a default value since we can't access Liquid variables in JS
    // In a real implementation, this could be passed via a data attribute or API call
    return window.CUSTOM_PRODUCT_MIN_QUANTITY || 1;
  }

  getDesignImageUrl(design) {
    // Try to get thumbnail from custom properties
    const customProps = design.cprops || {};
    if (customProps['customization-thumbnail']) {
      return customProps['customization-thumbnail'];
    }
    // Fallback to other image properties
    return design.iu || design.viu || design.iu_url || '';
  }

  getDesignTitle(design, index) {
    const customProps = design.cprops || {};

    // Try to get the custom color name first
    if (customProps['customization-color-name'] && customProps['customization-color-name'].trim()) {
      return customProps['customization-color-name'].trim();
    }

    // Legacy compatibility: Check bb-design format
    if (customProps['bb-design']) {
      try {
        const legacyDesign = JSON.parse(customProps['bb-design']);
        if (legacyDesign.colorName && legacyDesign.colorName.trim()) {
          return legacyDesign.colorName.trim();
        }
      } catch (e) {
        console.warn('Failed to parse legacy bb-design data for title:', e);
      }
    }

    // Try to get a meaningful title from design data
    if (customProps['design-id']) {
      return `Custom Design #${index + 1}`;
    }
    // Use the note as title if available and meaningful
    if (design.note && design.note.trim() && design.note !== 'Custom Design') {
      return design.note;
    }
    return design.dt || design.title || `Design #${index + 1}`;
  }

  getDesignSubtitle(design) {
    const customProps = design.cprops || {};
    // Show creation date if available
    if (customProps['created-date']) {
      try {
        const date = new Date(customProps['created-date']);
        return `Created ${date.toLocaleDateString()}`;
      } catch (e) {
        // Invalid date, continue to other options
      }
    }
    // Show color if available
    if (customProps['customization-color']) {
      return `Color: #${customProps['customization-color']}`;
    }
    return design.vt || '';
  }

  buildEditUrl(design) {
    // Get the base product URL
    let baseUrl = design.du;
    if (!baseUrl || baseUrl === '#') {
      // Try to construct URL from product/variant IDs if direct URL is not available
      const productId = design.empi;
      const variantId = design.epi;
      if (productId) {
        // Construct a basic product URL - you may need to adjust this based on your URL structure
        baseUrl = `/products/${productId}`;
        if (variantId) {
          baseUrl += `?variant=${variantId}`;
        }
      } else {
        return '#';
      }
    }

    try {
      const url = new URL(baseUrl, window.location.origin);
      const customProps = design.cprops || {};

      // Add variant if not already in URL
      const variantId = design.epi;
      if (variantId && !url.searchParams.has('variant')) {
        url.searchParams.set('variant', variantId);
      }

      // Map customization properties to the expected URL parameter format
      // Based on product-customization.js applyCustomizationFromUrl method

      // Color (expects hex without #)
      if (customProps['customization-color']) {
        const color = customProps['customization-color'].replace('#', '');
        url.searchParams.set('color', color);
      }
      // Logo URL
      if (customProps['customization-logo-url']) {
        url.searchParams.set('logoUrl', customProps['customization-logo-url']);
      }
      // Logo position (expects numeric value)
      if (customProps['customization-logo-position']) {
        url.searchParams.set('logoPos', customProps['customization-logo-position']);
      }
      // Logo size (expects numeric value)
      if (customProps['customization-logo-size']) {
        url.searchParams.set('logoSize', customProps['customization-logo-size']);
      }
      // Email address (for contact field)
      if (customProps['customization-email']) {
        url.searchParams.set('email', customProps['customization-email']);
      }

      // Color name (for custom color name field)
      if (customProps['customization-color-name']) {
        url.searchParams.set('colorName', customProps['customization-color-name']);
      }

      // Legacy compatibility: Support old bb-design format
      if (customProps['bb-design']) {
        try {
          const legacyDesign = JSON.parse(customProps['bb-design']);
          
          // Map legacy format to URL parameters
          if (legacyDesign.color && !url.searchParams.has('color')) {
            url.searchParams.set('color', legacyDesign.color.replace('#', ''));
          }
          if (legacyDesign.logoUrl && !url.searchParams.has('logoUrl')) {
            url.searchParams.set('logoUrl', legacyDesign.logoUrl);
          }
          if (legacyDesign.logoPos && !url.searchParams.has('logoPos')) {
            url.searchParams.set('logoPos', legacyDesign.logoPos);
          }
          if (legacyDesign.logoSize && !url.searchParams.has('logoSize')) {
            url.searchParams.set('logoSize', legacyDesign.logoSize);
          }
          if (legacyDesign.colorName && !url.searchParams.has('colorName')) {
            url.searchParams.set('colorName', legacyDesign.colorName);
          }
        } catch (e) {
          console.warn('Failed to parse legacy bb-design data:', e);
        }
      }

      return url.toString();

    } catch (e) {
      console.warn('Failed to build edit URL:', e);
      return baseUrl;
    }
  }

  async handleEditDesign(design, button) {
    try {
      button.disabled = true;
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Loading...';

      // Build the PDP URL with all design parameters
      const editUrl = this.buildEditUrl(design);

      if (!editUrl || editUrl === '#') {
        throw new Error('Invalid product URL for editing');
      }

      // Redirect to the PDP with preset parameters
      window.location.href = editUrl;

    } catch (error) {
      console.error('Failed to edit design:', error);

      // Show error feedback
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Error';
      button.style.backgroundColor = '#fecaca'; // Light red background
      // Show user-friendly error message
      setTimeout(() => {
        alert('Failed to open design editor. Please try again.');
      }, 100);
      // Reset button after 2 seconds
      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Edit Design';
        button.style.backgroundColor = '';
        button.disabled = false;
      }, 2000);
    }
  }

  async handleAddToCart(design, button) {
    try {
      button.disabled = true;
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Adding...';
      const variantId = this.extractVariantId(design);
      if (!variantId) {
        throw new Error('Missing variant ID');
      }

      // Get quantity from the card's quantity input
      const card = button.closest('.bg-white');
      const quantityInput = card.querySelector('.quantity-input');
      const quantity = quantityInput ? parseInt(quantityInput.value) || this.getMinQuantity() : this.getMinQuantity();

      const properties = this.parseDesignProperties(design);
      await this.addToCart(variantId, properties, quantity);

      // Show success feedback
      if (buttonText) buttonText.textContent = 'Added!';
      button.style.backgroundColor = '#d1fae5'; // Light green background

      // Reset button after 2 seconds
      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
        button.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('Failed to add to cart:', error);

      // Show error feedback
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Failed';
      button.style.backgroundColor = '#fecaca'; // Light red background
      // Reset button after 2 seconds
      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
        button.disabled = false;
      }, 2000);
    }
  }

  async handleDeleteDesign(design, button, index) {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to delete this design? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    try {
      // Show loading state on delete button
      const originalHTML = button.innerHTML;
      button.disabled = true;
      button.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      `;

      // Remove the design from Swym wishlist
      await this.deleteDesignFromSwym(design);

      // Remove from local designs array
      this.designs.splice(index, 1);

      // Re-render the designs grid
      if (this.designs.length === 0) {
        this.showEmptyState();
      } else {
        this.renderDesigns();
      }

    } catch (error) {
      console.error('Failed to delete design:', error);
      alert('Failed to delete design. Please try again.');

      // Reset button on error
      button.disabled = false;
      button.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      `;
    }
  }

  extractVariantId(design) {
    // Try different ways to get the variant ID based on Swym API structure
    return design.epi ||           // epi = variant ID (per Swym API)
           design.vid ||           // Legacy variant ID field
           design.empi ||          // empi = product ID (fallback)
           this.getVariantFromUrl(design.du) ||  // Extract from edit URL
           this.getVariantFromUrl(design.iu);    // Extract from image URL
  }

  getVariantFromUrl(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.searchParams.get('variant');
    } catch (e) {
      return null;
    }
  }

  parseDesignProperties(design) {
    const customProps = design.cprops || {};
    const properties = {};
    // Map custom properties back to Shopify line item properties format
    Object.keys(customProps).forEach(key => {
      if (key.startsWith('customization-')) {
        // Convert customization-color -> _customization_color
        const shopifyKey = '_' + key.replace(/-/g, '_');
        properties[shopifyKey] = customProps[key];
      } else if (key.startsWith('printable-area-')) {
        // Convert printable-area-top -> _customization_printable_area_top
        const shopifyKey = '_customization_' + key.replace(/-/g, '_');
        properties[shopifyKey] = customProps[key];
      }
    });

    // Legacy compatibility: Support old bb-design format
    if (customProps['bb-design']) {
      try {
        const legacyDesign = JSON.parse(customProps['bb-design']);
        
        // Map legacy properties to new format (only if not already set)
        if (legacyDesign.color && !properties['_customization_color']) {
          properties['_customization_color'] = legacyDesign.color;
        }
        if (legacyDesign.logoUrl && !properties['_customization_logo_url']) {
          properties['_customization_logo_url'] = legacyDesign.logoUrl;
        }
        if (legacyDesign.logoPos && !properties['_customization_logo_position']) {
          properties['_customization_logo_position'] = legacyDesign.logoPos;
        }
        if (legacyDesign.logoSize && !properties['_customization_logo_size']) {
          properties['_customization_logo_size'] = legacyDesign.logoSize;
        }
        if (legacyDesign.colorName && !properties['_customization_color_name']) {
          properties['_customization_color_name'] = legacyDesign.colorName;
        }
        if (legacyDesign.bottleImage && !properties['_customization_base_product_image_url']) {
          properties['_customization_base_product_image_url'] = legacyDesign.bottleImage;
        }
        
        // Map printable area from legacy format
        if (legacyDesign.printable) {
          if (legacyDesign.printable.top && !properties['_customization_printable_area_top']) {
            properties['_customization_printable_area_top'] = legacyDesign.printable.top;
          }
          if (legacyDesign.printable.bottom && !properties['_customization_printable_area_bottom']) {
            properties['_customization_printable_area_bottom'] = legacyDesign.printable.bottom;
          }
          if (legacyDesign.printable.left && !properties['_customization_printable_area_left']) {
            properties['_customization_printable_area_left'] = legacyDesign.printable.left;
          }
          if (legacyDesign.printable.right && !properties['_customization_printable_area_right']) {
            properties['_customization_printable_area_right'] = legacyDesign.printable.right;
          }
        }
      } catch (e) {
        console.warn('Failed to parse legacy bb-design data:', e);
      }
    }

    // Ensure acknowledgement is always set
    if (!properties['_customization_acknowledged']) {
      properties['_customization_acknowledged'] = 'true';
    }
    return properties;
  }

  async addToCart(variantId, properties, quantity = 1) {
    const formData = new FormData();
    formData.append('id', variantId);
    formData.append('quantity', String(quantity));
    // Add all properties
    Object.keys(properties || {}).forEach(key => {
      formData.append(`properties[${key}]`, properties[key]);
    });
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    return response.json();
  }

  async deleteDesignFromSwym(design) {
    const api = window._swat;
    return new Promise(async (resolve, reject) => {
      try {
        // Use the stored list ID from when we loaded the design
        let listId = design._listId;
        if (!listId) {
          // Fallback: try to find the list containing this design
          const lists = await this.getSwymLists();
          const myDesignsLists = this.findMyDesignsList(lists);

          if (!myDesignsLists || myDesignsLists.length === 0) {
            throw new Error('No My Designs lists found');
          }

          // Try to find which list contains this design
          let foundList = null;
          for (const list of myDesignsLists) {
            const designs = await this.getListItems(list);
            const designExists = designs.some(d =>
              d.epi === design.epi &&
              d.empi === design.empi &&
              d.cprops?.['design-id'] === design.cprops?.['design-id']
            );
            if (designExists) {
              foundList = list;
              break;
            }
          }

          if (!foundList) {
            throw new Error('Could not find the list containing this design');
          }

          listId = foundList.lid;
        }

        // Prepare the product object for deletion using the correct API format
        const product = {
          epi: design.epi,     // unique variant id per listid
          empi: design.empi,   // product id
          du: design.du        // product url
        };

        // Validate required fields
        if (!product.epi) {
          throw new Error('Design epi (variant ID) not found');
        }
        if (!product.empi) {
          throw new Error('Design empi (product ID) not found');
        }
        if (!product.du) {
          throw new Error('Design du (product URL) not found');
        }

        if (api.deleteFromList) {
          // Use the correct deleteFromList API format: deleteFromList(lid, product, onSuccess, onError)
          api.deleteFromList(listId, product,
            async (result) => {
              // Check if list is empty after deletion and delete it if so
              try {
                await this.checkAndDeleteEmptyList(listId);
              } catch (listCheckError) {
                console.warn('Error checking/deleting empty list:', listCheckError);
                // Don't reject the main promise since the item deletion succeeded
              }
              
              resolve(result);
            },
            (error) => {
              console.error('Failed to remove design from Swym list:', error);
              reject(new Error(`Failed to delete design: ${error?.message || error}`));
            }
          );
        } else {
          throw new Error('deleteFromList API method not available');
        }
      } catch (error) {
        console.error('Error in deleteDesignFromSwym:', error);
        reject(error);
      }
    });
  }

  async checkAndDeleteEmptyList(listId) {
    const api = window._swat;
    
    if (!api || !api.fetchListContents || !api.deleteList) {
      console.warn('Swym API methods not available for list cleanup');
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if the list still has any items
      api.fetchListContents(listId, (result) => {
        try {
          // result should be an array of list items
          const items = Array.isArray(result) ? result : (result.items || []);
          
          // If list is empty, delete it
          if (items.length === 0) {
            api.deleteList(listId, 
              (deleteResult) => {
                resolve(deleteResult);
              },
              (deleteError) => {
                console.error('Failed to delete empty list:', deleteError);
                reject(new Error(`Failed to delete empty list: ${deleteError?.message || deleteError}`));
              }
            );
          } else {
            // List is not empty, nothing to do
            resolve(null);
          }
        } catch (error) {
          console.error('Error processing list contents:', error);
          reject(error);
        }
      }, (fetchError) => {
        console.error('Failed to fetch list contents for cleanup check:', fetchError);
        reject(new Error(`Failed to check list contents: ${fetchError?.message || fetchError}`));
      });
    });
  }

  setLoadingState(loading) {
    const loadingEl = this.querySelector('#loading-state');
    const emptyEl = this.querySelector('#empty-state');
    const errorEl = this.querySelector('#error-state');
    const gridEl = this.querySelector('#designs-grid');
    if (loading) {
      loadingEl?.classList.remove('hidden');
      emptyEl?.classList.add('hidden');
      errorEl?.classList.add('hidden');
      gridEl?.classList.add('hidden');
    } else {
      loadingEl?.classList.add('hidden');
    }
    this.isLoading = loading;
  }

  showEmptyState() {
    const emptyEl = this.querySelector('#empty-state');
    const errorEl = this.querySelector('#error-state');
    const gridEl = this.querySelector('#designs-grid');
    emptyEl?.classList.remove('hidden');
    errorEl?.classList.add('hidden');
    gridEl?.classList.add('hidden');
  }

  showErrorState() {
    const emptyEl = this.querySelector('#empty-state');
    const errorEl = this.querySelector('#error-state');
    const gridEl = this.querySelector('#designs-grid');
    emptyEl?.classList.add('hidden');
    errorEl?.classList.remove('hidden');
    gridEl?.classList.add('hidden');
  }

  showDesignsGrid() {
    const emptyEl = this.querySelector('#empty-state');
    const errorEl = this.querySelector('#error-state');
    const gridEl = this.querySelector('#designs-grid');
    emptyEl?.classList.add('hidden');
    errorEl?.classList.add('hidden');
    gridEl?.classList.remove('hidden');
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Register the custom element
  if (!customElements.get('my-designs')) {
    customElements.define('my-designs', MyDesignsComponent);
  }
});
