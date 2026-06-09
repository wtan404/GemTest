
// --- MY DESIGNS COMPONENT ---
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
        <div id="designs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hidden"></div>
      </div>
    `;
  }

  async loadDesigns() {
    try {
      this.setLoadingState(true);
      await this.waitForSwym();
      const lists = await this.getSwymLists();
      const myDesignsLists = this.findMyDesignsList(lists);
      if (!myDesignsLists || myDesignsLists.length === 0) { this.showEmptyState(); return; }
      const allDesigns = await this.getAllDesignsFromLists(myDesignsLists);
      if (!allDesigns || allDesigns.length === 0) { this.showEmptyState(); return; }
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
        if (window._swat) return resolve(window._swat);
        if (Date.now() - startTime > timeoutMs) return reject(new Error('Swym wishlist service not available'));
        setTimeout(checkSwym, 250);
      };
      checkSwym();
    });
  }

  async getSwymLists() {
    const api = window._swat;
    return new Promise((resolve, reject) => {
      if (!api.fetchLists) { reject(new Error('fetchLists API method not available')); return; }
      api.fetchLists({
        callbackFn: (result) => {
          let lists = [];
          if (result) {
            if (Array.isArray(result)) lists = result;
            else if (result.lists && Array.isArray(result.lists)) lists = result.lists;
            else if (result.data && Array.isArray(result.data)) lists = result.data;
          }
          resolve(lists);
        },
        errorFn: (error) => { reject(new Error(`Failed to fetch lists: ${error?.message || error}`)); }
      });
    });
  }

  findMyDesignsList(lists) {
    return lists.filter(list => {
      if (list?.lname === 'My Designs' || list?.lname?.startsWith('My Designs ')) return true;
      if (list?.lprops) {
        const attr = list.lprops['my-designs'];
        return attr === 'true' || attr === true || attr === '1';
      }
      return false;
    });
  }

  async getAllDesignsFromLists(designsLists) {
    const allDesigns = [];
    for (const list of designsLists) {
      try {
        const designs = await this.getListItems(list);
        if (designs && designs.length > 0) {
          const designsWithListId = designs.map(design => ({ ...design, _listId: list.lid }));
          allDesigns.push(...designsWithListId);
        }
      } catch (error) { console.warn(`Failed to get designs from list ${list.lid}:`, error); }
    }
    allDesigns.sort((a, b) => {
      const dateA = a.cprops?.['created-date'] ? new Date(a.cprops['created-date']) : new Date(0);
      const dateB = b.cprops?.['created-date'] ? new Date(b.cprops['created-date']) : new Date(0);
      return dateB - dateA;
    });
    return allDesigns;
  }

  async getListItems(list) {
    if (Array.isArray(list.d) && list.d.length > 0) return list.d;
    try {
      const details = await this.getListDetails(list.lid);
      if (details?.items && Array.isArray(details.items)) return details.items;
      if (details?.list?.listcontents && Array.isArray(details.list.listcontents)) return details.list.listcontents;
      return details?.d || [];
    } catch (error) { return []; }
  }

  async getListDetails(listId) {
    const api = window._swat;
    return new Promise((resolve, reject) => {
      if (api.fetchListDetails) {
        api.fetchListDetails({ lid: listId }, (result) => { resolve(result); }, (error) => { reject(error); });
      } else if (api.fetchListContents) {
        api.fetchListContents(listId, (result) => { resolve(result); }, (error) => { reject(error); });
      } else { reject(new Error('List details API not available')); }
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
    const imageUrl = this.getDesignImageUrl(design);
    const title = this.getDesignTitle(design, index);
    const subtitle = this.getDesignSubtitle(design);

    card.innerHTML = `
      <div class="relative aspect-square bg-gray-100">
        <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlc2lnbjwvdGV4dD48L3N2Zz4='">
        <button class="delete-btn absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-black rounded-full flex items-center justify-center transition-colors shadow-md" data-design-index="${index}" title="Delete design">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
        </button>
      </div>
      <div class="p-4">
        <h3 class="font-medium text-gray-900 mb-1">${title}</h3>
        ${subtitle ? `<p class="text-sm text-gray-500 mb-4">${subtitle}</p>` : '<div class="mb-4"></div>'}
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Quantity</label>
          <div class="flex flex-nowrap items-center justify-start">
            <button type="button" class="quantity-btn-minus push-btn" aria-label="&minus;" data-action="decrement">
              <div class="push-btn__svg w-10 h-10"><svg class="theme-icon" width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" stroke="currentColor" stroke-width="2" d="M20 1c10.493 0 19 8.507 19 19s-8.507 19-19 19S1 30.493 1 20 9.507 1 20 1Z"/><path stroke="currentColor" stroke-width="3" d="M14 20.157h12.313"/></svg></div>
            </button>
            <input type="number" class="quantity-input input--no-border block max-w-[3rem] appearance-none border-0 bg-transparent p-2 text-center text-md text-scheme-text" value="${this.getMinQuantity()}" min="${this.getMinQuantity()}" step="1">
            <button type="button" class="quantity-btn-plus push-btn" aria-label="&plus;" data-action="increment">
              <div class="push-btn__svg w-10 h-10"><svg class="theme-icon" width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" stroke="currentColor" stroke-width="2" d="M20 1c10.493 0 19 8.507 19 19s-8.507 19-19 19S1 30.493 1 20 9.507 1 20 1Z"/><path stroke="currentColor" stroke-width="3" d="M14 20.157h12.313M19.948 26.314V14"/></svg></div>
            </button>
          </div>
          <div class="text-xs text-gray-500 mt-1">Minimum: ${this.getMinQuantity()}</div>
        </div>
        <div class="flex gap-2">
          <button type="button" class="edit-design-btn push-btn push-btn--pop flex-1" data-design-index="${index}"><span class="push-btn__surface w-full">Edit Design</span></button>
          <button type="button" class="add-to-cart-btn push-btn push-btn--pop flex-1" data-design-index="${index}"><span class="push-btn__surface w-full">Add to Cart</span></button>
        </div>
      </div>
    `;

    const editDesignBtn = card.querySelector('.edit-design-btn');
    editDesignBtn.addEventListener('click', () => this.handleEditDesign(design, editDesignBtn));
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => this.handleAddToCart(design, addToCartBtn));
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => this.handleDeleteDesign(design, deleteBtn, index));

    const quantityInput = card.querySelector('.quantity-input');
    const decrementBtn = card.querySelector('.quantity-btn-minus');
    const incrementBtn = card.querySelector('.quantity-btn-plus');
    decrementBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || this.getMinQuantity();
      const minValue = this.getMinQuantity();
      if (currentValue > minValue) quantityInput.value = currentValue - 1;
    });
    incrementBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || this.getMinQuantity();
      quantityInput.value = currentValue + 1;
    });
    quantityInput.addEventListener('input', () => {
      const value = parseInt(quantityInput.value);
      const minValue = this.getMinQuantity();
      if (isNaN(value) || value < minValue) quantityInput.value = minValue;
    });
    return card;
  }

  getMinQuantity() { return window.CUSTOM_PRODUCT_MIN_QUANTITY || 1; }

  getDesignImageUrl(design) {
    const customProps = design.cprops || {};
    if (customProps['customization-thumbnail']) return customProps['customization-thumbnail'];
    return design.iu || design.viu || design.iu_url || '';
  }

  getDesignTitle(design, index) {
    const customProps = design.cprops || {};
    if (customProps['customization-color-name'] && customProps['customization-color-name'].trim()) return customProps['customization-color-name'].trim();
    if (customProps['bb-design']) {
      try {
        const legacyDesign = JSON.parse(customProps['bb-design']);
        if (legacyDesign.colorName && legacyDesign.colorName.trim()) return legacyDesign.colorName.trim();
      } catch (e) { }
    }
    if (customProps['design-id']) return `Custom Design #${index + 1}`;
    if (design.note && design.note.trim() && design.note !== 'Custom Design') return design.note;
    return design.dt || design.title || `Design #${index + 1}`;
  }

  getDesignSubtitle(design) {
    const customProps = design.cprops || {};
    if (customProps['created-date']) {
      try {
        const date = new Date(customProps['created-date']);
        return `Created ${date.toLocaleDateString()}`;
      } catch (e) {}
    }
    if (customProps['customization-color']) return `Color: #${customProps['customization-color']}`;
    return design.vt || '';
  }

  buildEditUrl(design) {
    let baseUrl = design.du;
    if (!baseUrl || baseUrl === '#') {
      const productId = design.empi;
      const variantId = design.epi;
      if (productId) {
        baseUrl = `/products/${productId}`;
        if (variantId) baseUrl += `?variant=${variantId}`;
      } else return '#';
    }
    try {
      const url = new URL(baseUrl, window.location.origin);
      const customProps = design.cprops || {};
      const variantId = design.epi;
      if (variantId && !url.searchParams.has('variant')) url.searchParams.set('variant', variantId);
      
      if (customProps['customization-color']) url.searchParams.set('color', customProps['customization-color'].replace('#', ''));
      if (customProps['customization-logo-url']) url.searchParams.set('logoUrl', customProps['customization-logo-url']);
      if (customProps['customization-logo-position']) url.searchParams.set('logoPos', customProps['customization-logo-position']);
      if (customProps['customization-logo-size']) url.searchParams.set('logoSize', customProps['customization-logo-size']);
      if (customProps['customization-email']) url.searchParams.set('email', customProps['customization-email']);
      if (customProps['customization-color-name']) url.searchParams.set('colorName', customProps['customization-color-name']);

      if (customProps['bb-design']) {
        try {
          const legacyDesign = JSON.parse(customProps['bb-design']);
          if (legacyDesign.color && !url.searchParams.has('color')) url.searchParams.set('color', legacyDesign.color.replace('#', ''));
          if (legacyDesign.logoUrl && !url.searchParams.has('logoUrl')) url.searchParams.set('logoUrl', legacyDesign.logoUrl);
          if (legacyDesign.logoPos && !url.searchParams.has('logoPos')) url.searchParams.set('logoPos', legacyDesign.logoPos);
          if (legacyDesign.logoSize && !url.searchParams.has('logoSize')) url.searchParams.set('logoSize', legacyDesign.logoSize);
          if (legacyDesign.colorName && !url.searchParams.has('colorName')) url.searchParams.set('colorName', legacyDesign.colorName);
        } catch (e) { }
      }
      return url.toString();
    } catch (e) { return baseUrl; }
  }

  async handleEditDesign(design, button) {
    try {
      button.disabled = true;
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Loading...';
      const editUrl = this.buildEditUrl(design);
      if (!editUrl || editUrl === '#') throw new Error('Invalid product URL for editing');
      window.location.href = editUrl;
    } catch (error) {
      console.error('Failed to edit design:', error);
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Error';
      button.style.backgroundColor = '#fecaca';
      setTimeout(() => { alert('Failed to open design editor. Please try again.'); }, 100);
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
      if (!variantId) throw new Error('Missing variant ID');

      const card = button.closest('.bg-white');
      const quantityInput = card.querySelector('.quantity-input');
      const quantity = quantityInput ? parseInt(quantityInput.value) || this.getMinQuantity() : this.getMinQuantity();

      const properties = this.parseDesignProperties(design);
      await this.addToCart(variantId, properties, quantity);

      if (buttonText) buttonText.textContent = 'Added!';
      button.style.backgroundColor = '#d1fae5';

      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
        button.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const buttonText = button.querySelector('.push-btn__surface');
      if (buttonText) buttonText.textContent = 'Failed';
      button.style.backgroundColor = '#fecaca';
      setTimeout(() => {
        if (buttonText) buttonText.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
        button.disabled = false;
      }, 2000);
    }
  }

  async handleDeleteDesign(design, button, index) {
    const confirmed = confirm('Are you sure you want to delete this design? This action cannot be undone.');
    if (!confirmed) return;
    try {
      button.disabled = true;
      button.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>`;
      await this.deleteDesignFromSwym(design);
      this.designs.splice(index, 1);
      if (this.designs.length === 0) this.showEmptyState();
      else this.renderDesigns();
    } catch (error) {
      console.error('Failed to delete design:', error);
      alert('Failed to delete design. Please try again.');
      button.disabled = false;
      button.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`;
    }
  }

  extractVariantId(design) {
    return design.epi || design.vid || design.empi || this.getVariantFromUrl(design.du) || this.getVariantFromUrl(design.iu);
  }

  getVariantFromUrl(url) {
    if (!url) return null;
    try { return new URL(url, window.location.origin).searchParams.get('variant'); } catch (e) { return null; }
  }

  parseDesignProperties(design) {
    const customProps = design.cprops || {};
    const properties = {};
    Object.keys(customProps).forEach(key => {
      if (key.startsWith('customization-')) {
        properties['_' + key.replace(/-/g, '_')] = customProps[key];
      } else if (key.startsWith('printable-area-')) {
        properties['_customization_' + key.replace(/-/g, '_')] = customProps[key];
      }
    });

    if (customProps['bb-design']) {
      try {
        const legacyDesign = JSON.parse(customProps['bb-design']);
        if (legacyDesign.color && !properties['_customization_color']) properties['_customization_color'] = legacyDesign.color;
        if (legacyDesign.logoUrl && !properties['_customization_logo_url']) properties['_customization_logo_url'] = legacyDesign.logoUrl;
        if (legacyDesign.logoPos && !properties['_customization_logo_position']) properties['_customization_logo_position'] = legacyDesign.logoPos;
        if (legacyDesign.logoSize && !properties['_customization_logo_size']) properties['_customization_logo_size'] = legacyDesign.logoSize;
        if (legacyDesign.colorName && !properties['_customization_color_name']) properties['_customization_color_name'] = legacyDesign.colorName;
        if (legacyDesign.bottleImage && !properties['_customization_base_product_image_url']) properties['_customization_base_product_image_url'] = legacyDesign.bottleImage;
        if (legacyDesign.printable) {
          if (legacyDesign.printable.top && !properties['_customization_printable_area_top']) properties['_customization_printable_area_top'] = legacyDesign.printable.top;
          if (legacyDesign.printable.bottom && !properties['_customization_printable_area_bottom']) properties['_customization_printable_area_bottom'] = legacyDesign.printable.bottom;
          if (legacyDesign.printable.left && !properties['_customization_printable_area_left']) properties['_customization_printable_area_left'] = legacyDesign.printable.left;
          if (legacyDesign.printable.right && !properties['_customization_printable_area_right']) properties['_customization_printable_area_right'] = legacyDesign.printable.right;
        }
      } catch (e) { }
    }
    if (!properties['_customization_acknowledged']) properties['_customization_acknowledged'] = 'true';
    return properties;
  }

  async addToCart(variantId, properties, quantity = 1) {
    const formData = new FormData();
    formData.append('id', variantId);
    formData.append('quantity', String(quantity));
    Object.keys(properties || {}).forEach(key => { formData.append(`properties[${key}]`, properties[key]); });
    const response = await fetch('/cart/add.js', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  }

  async deleteDesignFromSwym(design) {
    const api = window._swat;
    return new Promise(async (resolve, reject) => {
      try {
        let listId = design._listId;
        if (!listId) {
          const lists = await this.getSwymLists();
          const myDesignsLists = this.findMyDesignsList(lists);
          if (!myDesignsLists || myDesignsLists.length === 0) throw new Error('No My Designs lists found');
          let foundList = null;
          for (const list of myDesignsLists) {
            const designs = await this.getListItems(list);
            const designExists = designs.some(d => d.epi === design.epi && d.empi === design.empi && d.cprops?.['design-id'] === design.cprops?.['design-id']);
            if (designExists) { foundList = list; break; }
          }
          if (!foundList) throw new Error('Could not find the list containing this design');
          listId = foundList.lid;
        }

        const product = { epi: design.epi, empi: design.empi, du: design.du };
        if (!product.epi || !product.empi || !product.du) throw new Error('Design data missing required fields');

        if (api.deleteFromList) {
          api.deleteFromList(listId, product, async (result) => {
            try { await this.checkAndDeleteEmptyList(listId); } catch (e) {}
            resolve(result);
          }, (error) => { reject(new Error(`Failed to delete design: ${error?.message || error}`)); });
        } else { throw new Error('deleteFromList API method not available'); }
      } catch (error) { reject(error); }
    });
  }

  async checkAndDeleteEmptyList(listId) {
    const api = window._swat;
    if (!api || !api.fetchListContents || !api.deleteList) return;
    return new Promise((resolve, reject) => {
      api.fetchListContents(listId, (result) => {
        try {
          const items = Array.isArray(result) ? result : (result.items || []);
          if (items.length === 0) {
            api.deleteList(listId, (res) => resolve(res), (err) => reject(new Error(`Failed: ${err?.message || err}`)));
          } else { resolve(null); }
        } catch (error) { reject(error); }
      }, (err) => reject(new Error(`Failed: ${err?.message || err}`)));
    });
  }

  setLoadingState(loading) {
    const [loadingEl, emptyEl, errorEl, gridEl] = ['#loading-state', '#empty-state', '#error-state', '#designs-grid'].map(id => this.querySelector(id));
    if (loading) {
      loadingEl?.classList.remove('hidden'); emptyEl?.classList.add('hidden'); errorEl?.classList.add('hidden'); gridEl?.classList.add('hidden');
    } else { loadingEl?.classList.add('hidden'); }
    this.isLoading = loading;
  }

  showEmptyState() {
    const [emptyEl, errorEl, gridEl] = ['#empty-state', '#error-state', '#designs-grid'].map(id => this.querySelector(id));
    emptyEl?.classList.remove('hidden'); errorEl?.classList.add('hidden'); gridEl?.classList.add('hidden');
  }

  showErrorState() {
    const [emptyEl, errorEl, gridEl] = ['#empty-state', '#error-state', '#designs-grid'].map(id => this.querySelector(id));
    emptyEl?.classList.add('hidden'); errorEl?.classList.remove('hidden'); gridEl?.classList.add('hidden');
  }

  showDesignsGrid() {
    const [emptyEl, errorEl, gridEl] = ['#empty-state', '#error-state', '#designs-grid'].map(id => this.querySelector(id));
    emptyEl?.classList.add('hidden'); errorEl?.classList.add('hidden'); gridEl?.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (!customElements.get('my-designs')) { customElements.define('my-designs', MyDesignsComponent); }
});