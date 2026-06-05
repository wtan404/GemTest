(function () {
  'use strict';

  // ----- DOM refs -----------------------------------------------------------
  var root = document.getElementById('swym-storefront-layout-section-container') || document.getElementById('my-designs');
  var gridEl = document.getElementById('my-designs-grid');
  var emptyEl = document.getElementById('my-designs-empty');
  var loaderEl = document.getElementById('my-designs-loader');
  if (!root || !gridEl) return;

  // ----- Config from data-* -------------------------------------------------
  var DS = root.dataset || {};
  var FILTER_BY_PREFIX = DS.filterByPrefix === 'true';
  var LIST_PREFIX = DS.listPrefix || 'My Designs';
  var MODE = DS.mode || 'merge';                 // "merge" | "single"
  var SHOW_REMOVE = DS.showRemove === 'true';
  var CURRENCY = DS.currency || (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD';

  // ----- Ready helper (Swym) -----------------------------------------------
  function onSwymReady(cb) {
    window.SwymCallbacks = window.SwymCallbacks || [];
    window.SwymCallbacks.push(function (swat) { cb(swat || window._swat); });
    document.addEventListener('swym:ready', function () { cb(window._swat); }, { once: true });
    var t0 = Date.now();
    var iv = setInterval(function () {
      if (window._swat) { clearInterval(iv); cb(window._swat); }
      if (Date.now() - t0 > 15000) { clearInterval(iv); console.warn('[Wishlist] Swym not ready after 15s'); }
    }, 200);
  }

  // ----- Small utils --------------------------------------------------------
  function showLoader(v) { if (loaderEl) loaderEl.style.display = v ? '' : 'none'; }
  function toggleEmpty(v) { if (emptyEl) emptyEl.style.display = v ? '' : 'none'; gridEl.style.display = v ? 'none' : ''; }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }); }
  function tryParseJSON(s) { try { return JSON.parse(s); } catch (_) { return null; } }

  function updateCount(n) {
    var el = document.getElementById('my-designs-count');
    if (!el) return;
    el.textContent = (Number(n) || 0) + ((Number(n) || 0) === 1 ? ' item' : ' items');
  }

  // ----- Product helpers ----------------------------------------------------
  var __productCache = Object.create(null);

  function extractHandleFromUrl(href) {
    try {
      var u = new URL(href, location.origin);
      var m = u.pathname.match(/\/products\/([^/?#]+)/);
      return m ? decodeURIComponent(m[1]) : null;
    } catch (_) { return null; }
  }

  function fetchProductByHandle(handle) {
    if (!handle) return Promise.resolve(null);
    if (__productCache[handle]) return __productCache[handle];
    __productCache[handle] = fetch('/products/' + encodeURIComponent(handle) + '.js', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return __productCache[handle];
  }

  function formatCents(cents, currency) {
    if (!Number.isFinite(cents)) return '';
    if (window.Shopify && typeof Shopify.formatMoney === 'function') return Shopify.formatMoney(cents);
    return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: currency || CURRENCY });
  }

  function getVariantFromProduct(product, variantId) {
    if (!product) return null;
    var vid = String(variantId || '');
    var vs = product.variants || [];
    for (var i = 0; i < vs.length; i++) { if (String(vs[i].id) === vid) return vs[i]; }
    return null;
  }

  // ----- Design helpers -----------------------------------------------------
  var USE_DUMMY_IMAGE_FOR_DATAURL = true;
  var DUMMY_LOGO_URL = 'https://blankbeauty.com/cdn/shop/files/BottleAssetsforShopify_dummy.png';

  function isDesignItem(item) {
    var cp = (item && item.cprops) || {};
    var du = (item && item.du) || '';
    return !!(cp['design-id'] || cp['designId'] || cp['customization-thumbnail'] || cp['deepLink'] || cp['resume_url'] || cp['edit_url'] || /designId=|view=custom|logoUrl=|color=/.test(du));
  }

  function extractDesignProps(item) {
    var cp = (item && item.cprops) || {};
    var packed = tryParseJSON(cp['bb-design']) || {};
    return {
      color: cp['customization-color'] || packed.color || '',
      logoUrl: cp['customization-logo-url'] || packed.logoUrl || '',
      logoPos: cp['customization-logo-position'] || packed.logoPos || cp['logoPos'] || '0',
      logoSize: cp['customization-logo-size'] || packed.logoSize || cp['logoSize'] || '50',
      email: cp['customization-email'] || cp['email'] || '',
      designId: cp['design-id'] || cp['designId'] || packed['design-id'] || '',
      variant: cp['product-variant-id'] || item.epi || ''
    };
  }

  function buildEditUrlFromItem(item) {
    try {
      var base = (item && item.du) ? item.du : (window.location.origin + '/products');
      var u = new URL(base, window.location.origin);
      u.search = '';
      var p = extractDesignProps(item);
      if (p.logoUrl && p.logoUrl.indexOf('data:') === 0) p.logoUrl = USE_DUMMY_IMAGE_FOR_DATAURL ? DUMMY_LOGO_URL : '';

      u.searchParams.set('view', 'customization');
      if (p.color) u.searchParams.set('color', String(p.color).replace('#', ''));
      if (p.logoUrl) u.searchParams.set('logoUrl', p.logoUrl);
      if (p.logoPos) u.searchParams.set('logoPos', String(p.logoPos));
      if (p.logoSize) u.searchParams.set('logoSize', String(p.logoSize));
      if (p.variant) u.searchParams.set('variant', String(p.variant));
      if (p.designId) u.searchParams.set('designId', String(p.designId));
      if (p.email) u.searchParams.set('email', String(p.email));
      return u.href;
    } catch (e) {
      console.warn('[Wishlist] buildEditUrlFromItem failed:', e);
      return '';
    }
  }

  function pickImage(item) {
    var cp = item.cprops || {};
    return cp['customization-thumbnail'] || cp['displayImage'] || cp['thumb'] || item.iu || '';
  }
  function pickTitle(item) {
    var cp = item.cprops || {};
    return cp['custom_title'] || cp['displayTitle'] || cp['title'] || item.dt || 'Design';
  }
  function pickLink(item) {
    var cp = item.cprops || {};
    var du = item.du || '';
    if (du && /designId=|view=custom|logoUrl=|color=/.test(du)) return du;      // canonical
    var rebuilt = buildEditUrlFromItem(item);                                   // try rebuild from cprops
    if (rebuilt) return rebuilt;
    return cp.deepLink || cp.resume_url || cp.edit_url || du || '#';            // fallback
  }

  // ----- Properties mapping (cprops -> line item properties) ----------------
  function mapCpropsToLineItemProperties(cprops) {
    var cp = cprops || {}, out = {};
    function set(k, v) { if (v !== undefined && v !== null && v !== '') out[k] = String(v); }

    var color = cp['customization-color'] || cp['customization_color'];
    if (typeof color === 'string') color = color.replace('#', '');

    var bottleUrl =
      cp['customization-bottle-image'] ||
      cp['customization_bottle_image_url'] ||
      cp['bb-bottle'] ||
      cp['bottleImage'] || '';

    set('_customization_color', color);
    set('_customization_email', cp['customization-email'] || cp['customization_email']);
    set('_customization_acknowledged', cp['customization_acknowledged'] || 'true');
    set('_customization_thumbnail', cp['customization-thumbnail'] || cp['customization_thumbnail']);
    set('_customization_logo_url', cp['customization-logo-url'] || cp['customization_logo_url']);
    set('_customization_logo_position', cp['customization-logo-position'] || cp['customization_logo_position']);
    set('_customization_logo_size', cp['customization-logo-size'] || cp['customization_logo_size']);
    set('_customization_bottle_image_url', bottleUrl);
    set('_customization_printable_area_top', cp['printable-area-top'] || cp['customization_printable_area_top']);
    set('_customization_printable_area_bottom', cp['printable-area-bottom'] || cp['customization_printable_area_bottom']);
    set('_customization_printable_area_left', cp['printable-area-left'] || cp['customization_printable_area_left']);
    set('_customization_printable_area_right', cp['printable-area-right'] || cp['customization_printable_area_right']);
    return out;
  }

  // ----- Render one card (docs-style markup) --------------------------------
  // Build wishlist item theo markup demo docs (template literals)
  function createCardEl(item, listId){
    const DESIGN  = isDesignItem(item);
    const cp      = item.cprops || {};
    const href    = DESIGN ? pickLink(item) : item.du;
    const title   = pickTitle(item);
    const imgSrc  = (item.productData && item.productData.featured_image) || pickImage(item);
    const currency = CURRENCY;

    const el = document.createElement('div');
    el.className    = 'swymcs-wishlistplus-item';
    el.dataset.lid  = listId || '';
    el.dataset.epi  = item.epi  || '';
    el.dataset.empi = item.empi || '';
    el.dataset.du   = item.du   || '';

    el.innerHTML = `
      <div class="swym-storefront-layout-grid-item">
        <a href="${href}" class="swym-storefront-layout-grid-item-image-container">
          <img
            src="${imgSrc}"
            class="swym-storefront-layout-grid-item-image"
            alt="${escapeHtml(title)}"
            loading="lazy"
          />
        </a>

        <div class="swym-storefront-layout-grid-item-content">
          <a href="${href}" class="swymcs-wishlistplus-item-title">
            ${escapeHtml(title)}
          </a>

          <div class="swym-storefront-layout-grid-item-price-variant">
            <span class="swym-storefront-layout-grid-item-final-price" data-role="price"></span>
          </div>

          <div class="swym-storefront-layout-grid-item-action-container">
            <button
              class="swym-storefront-layout-grid-item-add-to-cart-button swymcs-wishlistplus-item-add-to-cart-button"
              data-action="add-to-cart"
            >
              Add To Cart +
            </button>

            ${SHOW_REMOVE ? `
              <button
                class="swym-storefront-layout-grid-item-add-to-cart-button swymcs-wishlistplus-item-remove"
                data-action="remove"
                aria-label="Delete"
              >
                Remove
              </button>
            ` : ``}
          </div>
        </div>
      </div>
    `;

    // Actions
    const btnRemove = el.querySelector('[data-action="remove"]');
    if (btnRemove) btnRemove.addEventListener('click', (e) => { e.preventDefault(); removeItem(el); });

    if (DESIGN) {
      const btnGo = el.querySelector('[data-action="continue"]');
      if (btnGo) btnGo.addEventListener('click', (e) => { e.preventDefault(); window.location.href = href; });
    }

    const btnATC = el.querySelector('[data-action="add-to-cart"]');
    if (btnATC) btnATC.addEventListener('click', (e) => {
      e.preventDefault();
      if (btnATC.disabled) return;

      const payload = {
        id: String(item.epi),
        quantity: Number(item.qty) || 1,
        properties: mapCpropsToLineItemProperties(cp)
      };

      btnATC.disabled = true;
      const prev = btnATC.textContent;
      btnATC.textContent = 'Adding…';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(payload)
      })
        .then((r) => { if(!r.ok) throw new Error('Cart add failed'); return r.json(); })
        .then(() => { btnATC.textContent = 'Added'; setTimeout(() => { btnATC.textContent = prev; btnATC.disabled = false; }, 1200); })
        .catch((err) => { console.error('[Wishlist] ATC error:', err); btnATC.textContent = prev; btnATC.disabled = false; alert('Could not add to cart.'); });
    });

    const priceEl = el.querySelector('[data-role="price"]');
    const imgEl   = el.querySelector('.swym-storefront-layout-grid-item-image');

    (async () => {
      try {
        let product = item.productData || null;
        if (!product) {
          const handle = extractHandleFromUrl(href || item.du || '');
          if (handle) product = await fetchProductByHandle(handle);
        }

        if (priceEl) {
          const v = product ? getVariantFromProduct(product, item.epi) : null;
          let cents = null;
          if (v && v.price != null)       cents = typeof v.price === 'number' ? v.price : parseInt(v.price, 10);
          else if (product?.price != null)cents = typeof product.price === 'number' ? product.price : parseInt(product.price, 10);
          else if (typeof item.pr === 'number') cents = Math.round(item.pr * 100);
          priceEl.textContent = formatCents(cents, CURRENCY) || '';
        }

        const atcBtn = el.querySelector('[data-action="add-to-cart"]');
        if (product && atcBtn) {
          const v2 = getVariantFromProduct(product, item.epi) || product.variants?.[0];
          const available = v2 ? !!v2.available : true;
          if (!available) {
            atcBtn.disabled = true;
            atcBtn.textContent = 'Sold Out';
            el.classList.add('is-soldout');
          }
        }

        if (!DESIGN && product?.images?.[0] && imgEl) imgEl.src = product.images[0];
      } catch (err) {
        console.warn('[Wishlist] enrich failed:', err);
        if (priceEl && typeof item.pr === 'number') priceEl.textContent = formatCents(Math.round(item.pr * 100), CURRENCY);
      }
    })();

    return el;
  }


  // ----- Data helpers -------------------------------------------------------
  function normalizeLists(listsRaw) {
    var lists = (listsRaw && (listsRaw.lists || listsRaw)) || [];
    return (Array.isArray(lists) ? lists : []).map(function (l) {
      return { lid: l.lid || l.id, lname: l.lname || l.name, lprops: l.lprops || l.props || {}, listcontents: l.listcontents || [] };
    }).reverse();
  }

  function removeItem(cardEl) {
    var swat = window._swat;
    if (!swat || !swat.deleteFromList) return alert('Remove unavailable.');
    var lid = cardEl.dataset.lid;
    var product = { epi: cardEl.dataset.epi, empi: cardEl.dataset.empi, du: cardEl.dataset.du };
    swat.deleteFromList(lid, product, function () {
      cardEl.remove();
      updateCount(gridEl.children.length);
      if (!gridEl.children.length) toggleEmpty(true);
    }, function (err) {
      console.error('[Wishlist] deleteFromList error:', err);
      alert('Failed to remove. Please try again.');
    });
  }

  // ----- Bootstrap ----------------------------------------------------------
  onSwymReady(function (swat) {
    if (!swat || !swat.fetchLists) { console.error('[Wishlist] fetchLists not available'); toggleEmpty(true); return; }
    showLoader(true);

    swat.fetchLists({
      callbackFn: function (listsRaw) {
        var lists = normalizeLists(listsRaw);

        // Choose lists
        var target = lists;
        if (MODE === 'single') {
          var pick = null;
          if (FILTER_BY_PREFIX && LIST_PREFIX) pick = lists.find(function (l) { return (l.lname || '').startsWith(LIST_PREFIX); });
          target = [pick || lists[0]].filter(Boolean);
        } else if (FILTER_BY_PREFIX && LIST_PREFIX) {
          // include "My Designs*" + default wishlist
          var a = lists.filter(function (l) {
            return (l.lname || '').startsWith(LIST_PREFIX)
              || l.lprops['my-designs'] === true
              || l.lprops['my-designs'] === 'true'
              || l.lprops['list-type'] === 'custom-designs';
          });
          var def = lists.find(function (l) { return /wishlist/i.test(l.lname || ''); });
          if (def) a.push(def);
          // dedupe by lid
          var seen = Object.create(null), merged = [];
          for (var i = 0; i < a.length; i++) { var L = a[i]; if (L && L.lid && !seen[L.lid]) { seen[L.lid] = 1; merged.push(L); } }
          target = merged.length ? merged : lists;
        }

        // Flatten items
        var all = [];
        for (var i = 0; i < target.length; i++) {
          var l = target[i], arr = Array.isArray(l.listcontents) ? l.listcontents : [];
          for (var j = 0; j < arr.length; j++) { var it = arr[j]; it.__lid = l.lid; all.push(it); }
        }

        gridEl.innerHTML = '';
        if (!all.length) { showLoader(false); toggleEmpty(true); updateCount(0); return; }

        for (var k = 0; k < all.length; k++) gridEl.appendChild(createCardEl(all[k], all[k].__lid));

        showLoader(false);
        toggleEmpty(false);
        updateCount(all.length);
      },
      errorFn: function (err) {
        console.error('[Wishlist] fetchLists error:', err);
        showLoader(false);
        toggleEmpty(true);
      }
    });
  });
})();
