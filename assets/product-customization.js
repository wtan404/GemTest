/**
 * Product Customization Web Component
 * Handles all interactive functionality for the product customization section
 */

// Use dummy image behavior to bypass network image APIs during development/testing
const BB_USE_DUMMY_IMAGE_APIS = false;

class ProductCustomizationComponent extends HTMLElement {
  constructor() {
    super();
    this.currentLogoUrl = '';
    this.logoFile = null;
    this.canvasContext = null;
    this.imageData = null;
    this.userHasSelectedColor = false; // Track if user has actively selected a color
    this.currentSVGBlobUrl = null; // Track current SVG blob URL for cleanup
    this.customizationType = 'logo'; // 'logo' or 'text'
    this.customTextValue = '';
    this.customFont = 'sans-serif';
  }

  async connectedCallback() {
    // Get data from attributes
    this.sectionId = this.dataset.sectionId;
    this.productId = this.dataset.productId;
    this.variantId = this.dataset.variantId;
    this.minQuantity = window.CUSTOM_PRODUCT_MIN_QUANTITY || parseInt(this.dataset.minQuantity) || 1;
    // Validate critical data attributes
    if (!this.productId) {
      console.error('Missing data-product-id attribute on <product-customization> element');
    }
    if (!this.variantId) {
      console.error('Missing data-variant-id attribute on <product-customization> element');
    }
    // Get printable area bounds
    this.printableTop = parseInt(this.dataset.printableTop) || 20;
    this.printableBottom = parseInt(this.dataset.printableBottom) || 20;
    this.printableLeft = parseInt(this.dataset.printableLeft) || 20;
    this.printableRight = parseInt(this.dataset.printableRight) || 20;

    // Get base product image URL and API base URL
    this.baseProductImageUrl = this.dataset.baseProductImage || '';
    this.apiBaseUrl = this.dataset.apiBaseUrl;

    // Ensure base product image URL has HTTPS protocol
    if (this.baseProductImageUrl && this.baseProductImageUrl.startsWith('//')) {
      this.baseProductImageUrl = 'https:' + this.baseProductImageUrl;
    }

    // Initialize component
    this.initElements();
    this.bindEvents();
    this.initializeDefaults();
    this.updatePercentageDisplays(); // Initialize percentage displays
    this.validateForm();

    // Validate base product image is SVG
    try {
      await this.validateBaseProductImage();
    } catch (error) {
      console.error('Error validating base product image:', error);
    }

    // Try prefill from URL params for editing saved designs
    this.applyCustomizationFromUrl();
  }

  disconnectedCallback() {
    // Clean up blob URLs to prevent memory leaks
    if (this.currentSVGBlobUrl) {
      URL.revokeObjectURL(this.currentSVGBlobUrl);
      this.currentSVGBlobUrl = null;
    }
  }

  initializeDefaults() {
    // Check for URL parameter 'color' and use it if present
    const urlParams = new URLSearchParams(window.location.search);
    const colorParam = urlParams.get('color');
    let initialColor;
    if (colorParam && /^[A-Fa-f0-9]{6}$/.test(colorParam)) {
      // Use URL parameter if valid
      initialColor = colorParam.toUpperCase();
    } else {
      // Use the color from the template (section setting or default)
      initialColor = this.getColorHexValue() || 'ffffff';
    }

    // Set initial color values only if we have an initial color
    if (initialColor && initialColor.length === 6) {
      this.setColorHexValue(initialColor);
      if (this.colorPicker) {
        this.colorPicker.value = '#' + initialColor;
      }
    }

    // Set initial color background - delay to ensure DOM is ready
    setTimeout(async () => {
      try {
        await this.updateBottleBackground();
      } catch (error) {
        console.error('Error setting initial bottle background:', error);
      }
      this.validateForm();
      this.updateTotalPrice();
    }, 100);
  }

  /**
   * Ensure URL has HTTPS protocol
   */
  ensureHttpsProtocol(url) {
    if (!url) return url;
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    return url;
  }

  // Helper methods for hex display div
  getColorHexValue() {
    return this.colorHex?.dataset.value || this.colorHex?.textContent || '';
  }

  setColorHexValue(value) {
    if (this.colorHex && value) {
      this.colorHex.dataset.value = value;
      this.colorHex.textContent = '#' + value.toUpperCase();
    } else if (this.colorHex && !value) {
      this.colorHex.dataset.value = '';
      this.colorHex.textContent = '#FFFFFF';
    }
  }

  initElements() {
    const id = this.sectionId;

    // Core elements
    this.baseProductImage = this.querySelector(`#base-product-image-${id}`);
    this.form = this.querySelector(`#customization-form-${id}`);

    // Color elements
    this.colorPicker = this.querySelector(`#color-picker-${id}`);
    this.colorHex = this.querySelector(`#color-hex-${id}`);
    this.colorImageUpload = this.querySelector(`#color-image-upload-${id}`);
    this.colorImagePreview = this.querySelector(`#color-image-preview-${id}`);
    this.colorCanvas = this.querySelector(`#color-canvas-${id}`);
    this.colorTooltip = this.querySelector(`#color-tooltip-${id}`);
    this.colorMarker = this.querySelector(`#color-marker-${id}`);
    // Logo elements
    
    this.typeToggles = this.querySelectorAll(`input[name="customization_type_${this.sectionId}"]`);
    this.logoContainer = this.querySelector(`#logo-upload-container-${this.sectionId}`);
    this.textContainer = this.querySelector(`#text-input-container-${this.sectionId}`);
    this.textInput = this.querySelector(`#custom-text-${this.sectionId}`);

    this.logoUpload = this.querySelector(`#logo-upload-${id}`);
    this.logoWarning = this.querySelector(`#logo-warning-${id}`);
    this.logoControls = this.querySelector(`#logo-controls-${id}`);
    this.logoPosition = this.querySelector(`#logo-position-${id}`);
    this.logoSize = this.querySelector(`#logo-size-${id}`);
    this.logoPositionValueEls = this.querySelectorAll('.js-logo-position-value');
    this.logoSizeValueEls = this.querySelectorAll('.js-logo-size-value');
    this.logoPreview = this.querySelector(`#logo-preview-${id}`);
    this.logoImage = this.querySelector(`#logo-image-${id}`);
    this.fontSelect = this.querySelector(`#custom-font-${id}`);
    //this.fontSizeSelect = this.querySelector(`#custom-font-size-${id}`);
    // Preview Text Overlay (Create if not exists)
    if (this.logoPreview) {
      this.logoPreviewText = this.logoPreview.querySelector('.preview-text-overlay');
      if (!this.logoPreviewText) {
        this.logoPreviewText = document.createElement('span');
        this.logoPreviewText.className = 'preview-text-overlay';
        this.logoPreview.appendChild(this.logoPreviewText);
      }
    }
    // Form elements
    this.colorName = this.querySelector(`#color-name-${id}`);
    this.acknowledgement = this.querySelector(`#acknowledgement-${id}`);
    this.variantSelect = this.querySelector(`#variant-select-${id}`);
    this.quantity = this.querySelector(`#quantity-${id}`);
    this.decrementButton = this.querySelector('.quantity-button[data-action="decrement"]')
    this.addToCartBtn = this.querySelector(`#add-to-cart-${id}`);
    this.addToCartText = this.querySelector(`#add-to-cart-text-${id}`);
    this.priceDisplay = this.querySelector(`#price-data-${id}`);
    this.loadingSpinner = this.querySelector(`#loading-spinner-${id}`);

    // New: Save Design button elements
    this.saveBtn = this.querySelector(`#save-design-${id}`);
    this.saveBtnText = this.querySelector(`#save-design-text-${id}`);
    // Error elements
    this.errorMessage = this.querySelector(`#error-message-${id}`);
    this.errorText = this.querySelector(`#error-text-${id}`);
  }

  bindEvents() {
    // Color picker events
    this.colorPicker?.addEventListener('input', (e) => this.handleColorPickerChange(e));
    this.colorHex?.addEventListener('click', () => this.handleColorHexClick());
    // Image color picker events
    this.colorImageUpload?.addEventListener('change', (e) => this.handleImageUpload(e));
    this.colorCanvas?.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
    this.colorCanvas?.addEventListener('mouseleave', () => this.handleCanvasMouseLeave());
    this.colorCanvas?.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.colorCanvas?.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
    this.colorCanvas?.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
    this.colorCanvas?.addEventListener('touchend', (e) => this.handleTouch(e), { passive: false });
    // Logo events
    // Handle Mode Switching
    this.typeToggles.forEach(radio => {
      radio.addEventListener('change', (e) => this.handleModeChange(e.target.value));
    });

    // Handle Text Typing
    this.textInput?.addEventListener('input', (e) => {
      this.customTextValue = e.target.value;
      this.updateTextPreview();
    });
    this.logoUpload?.addEventListener('change', (e) => this.handleLogoUpload(e));
    this.logoPosition?.addEventListener('input', () => {
      this.updateLogoPosition();
      this.updatePercentageDisplays();
    });
    this.logoSize?.addEventListener('input', () => {
      this.updateLogoPosition();
      this.updatePercentageDisplays();
    });
    this.fontSelect?.addEventListener('change', (e) => {
      this.customFont = e.target.value;
      this.updateTextPreview();
    });
    /*
    this.fontSizeSelect?.addEventListener('change', (e) => {
      this.updateTextPreview();
    });
    */
    // Form validation events
    this.contactEmail?.addEventListener('input', () => {
      this.validateForm();
      this.updateStepsState();
    });
    this.colorName?.addEventListener('input', () => {
      this.validateForm();
      this.updateStepsState();
    });
    this.quantity?.addEventListener('input', () => {
      this.validateForm();
      this.updateTotalPrice(); // ADD THIS
    });
    this.acknowledgement?.addEventListener('change', () => {
      this.validateForm();
      this.updateStepsState();
    });
    this.colorPicker?.addEventListener('input', () => {
      this.validateForm();
      this.updateStepsState();
    });
    this.variantSelect?.addEventListener('change', (e) => {
      this.handleVariantChange(e);
      this.updateTotalPrice(); // ADD THIS
    });
    // Accordion functionality
    this.initAccordion();

    // Form submission
    this.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Save my Design
    this.saveBtn?.addEventListener('click', () => this.handleSaveDesign());
    // Quantity buttons
    this.querySelectorAll('.quantity-button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuantityButtonClick(e));
    });



    // File upload buttons
    const buttonUploadEls = this.querySelectorAll('.file-upload-button[data-target], .file-upload-dropzone[data-target]')
    buttonUploadEls.length > 0 && buttonUploadEls.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFileUploadButtonClick(e));
    });

    const dropzones = this.querySelectorAll('.file-upload-dropzone[data-target]');
    dropzones.length > 0 && dropzones.forEach(dz => {
      ['dragenter', 'dragover'].forEach(evt =>
        dz.addEventListener(evt, (e) => this.handleDropzoneDragOver(e))
      );
      ['dragleave', 'dragend'].forEach(evt =>
        dz.addEventListener(evt, (e) => this.handleDropzoneDragLeave(e))
      );
      dz.addEventListener('drop', (e) => this.handleDropzoneDrop(e));
    });

    // Update bottle background when color changes
    this.colorPicker?.addEventListener('input', async () => {
      try {
        await this.updateBottleBackground();
      } catch (error) {
        console.error('Error updating bottle background:', error);
      }
    });

    this.querySelectorAll('.remove-upload-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        if (action === 'remove-logo') this.removeLogo();
        if (action === 'remove-color') this.removeColorImage();
      });
    });
  }

  handleDropzoneDragOver (e) {
    e.preventDefault();
    e.stopPropagation();
    const dz = e.currentTarget;
    dz.classList.add('is-dragover');
  };

  handleDropzoneDragLeave (e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('is-dragover');
  };

  initAccordion() {
    // Initialize accordion steps
    this.accordionSteps = this.querySelectorAll('.accordion-step');
    this.currentStep = 1;

    // Set up accordion headers
    this.accordionSteps.forEach(step => {
      const header = step.querySelector('.form-section-header');
      const nextBtn = step.querySelector('.next-step-btn');

      if (header) {
        header.addEventListener('click', (e) => this.handleAccordionToggle(e));
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => this.handleNextStep(e));
      }
    });

    // Initialize first step as expanded, others collapsed
    this.accordionSteps.forEach(step => {
      const stepNumber = parseInt(step.dataset.step);
      this.setStepExpanded(stepNumber, stepNumber === 1);
    });
    this.updateStepsState();
  }

  handleAccordionToggle(e) {
    e.preventDefault();
    const step = e.currentTarget.closest('.accordion-step');
    const stepNumber = parseInt(step.dataset.step);

    // Only allow toggling if step is enabled
    if (this.isStepEnabled(stepNumber)) {
      const isExpanded = step.getAttribute('aria-expanded') === 'true';

      // Collapse all steps
      this.accordionSteps.forEach(s => this.setStepExpanded(parseInt(s.dataset.step), false));

      // Expand this step if it wasn't expanded
      if (!isExpanded) {
        this.setStepExpanded(stepNumber, true);
        this.currentStep = stepNumber;
      }
    }
  }

  handleNextStep(e) {
    e.preventDefault();
    e.stopPropagation();

    const currentStepEl = e.currentTarget.closest('.accordion-step');
    const targetStep = parseInt(e.currentTarget.dataset.targetStep);

    if (this.isStepValid(parseInt(currentStepEl.dataset.step))) {
      // Collapse current step
      this.setStepExpanded(parseInt(currentStepEl.dataset.step), false);

      // Expand target step
      this.setStepExpanded(targetStep, true);
      this.currentStep = targetStep;

      this.updateStepsState();
    }
  }

  setStepExpanded(stepNumber, expanded) {
    const step = this.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
      step.setAttribute('aria-expanded', expanded.toString());
      const header = step.querySelector('.form-section-header');
      if (header) {
        header.setAttribute('aria-expanded', expanded.toString());
      }
    }
  }

  isStepEnabled(stepNumber) {
    // Step 1 is always enabled
    if (stepNumber === 1) return true;

    // Step 2 is enabled if step 1 is valid
    if (stepNumber === 2) return this.isStepValid(1);

    // Step 3 is enabled if step 2 is valid
    if (stepNumber === 3) return true;//this.isStepValid(2);

    return false;
  }

  isStepValid(stepNumber) {
    switch (stepNumber) {
      case 1:
        // Color step: needs valid color selection, user must have actively selected it, AND color name
        const colorValue = this.getColorHexValue()?.trim() || '';
        const hasValidColor = colorValue.length === 6 && /^[A-Fa-f0-9]{6}$/.test(colorValue);
        const colorNameValue = this.colorName?.value?.trim() || '';
        const hasValidColorName = colorNameValue.length > 0;
        return hasValidColor && this.userHasSelectedColor && hasValidColorName;

      case 2:
        return true;

      case 3:
        return this.acknowledgement?.checked === true;

      default:
        return false;
    }
  }

  updateStepsState() {
    this.accordionSteps.forEach(step => {
      const stepNumber = parseInt(step.dataset.step);
      const header = step.querySelector('.form-section-header');
      const nextBtn = step.querySelector('.next-step-btn');

      // Update step enabled/disabled state
      const isEnabled = this.isStepEnabled(stepNumber);
      const isValid = this.isStepValid(stepNumber);

      if (header) {
        header.style.opacity = isEnabled ? '1' : '0.5';
        header.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
      }

      if (nextBtn) {
        nextBtn.disabled = !isValid;
      }
    });
  }

  handleColorPickerChange(e) {
    const color = e.target.value;
    this.setColorHexValue(color.substring(1).toUpperCase());
    this.updateBottleColor(color);
    this.userHasSelectedColor = true; // Mark that user has actively selected a color
    this.validateForm();
    this.updateStepsState();
  }

  handleDropzoneDrop (e) {
    e.preventDefault();
    e.stopPropagation();

    const dz = e.currentTarget;
    dz.classList.remove('is-dragover');

    const targetId = dz.getAttribute('data-target');
    if (!targetId) return;

    const input = this.querySelector(`#${targetId}`);
    if (!input) return;

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;

    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  handleColorHexClick() {
    // Copy hex value to clipboard when clicked
    const hexValue = this.getColorHexValue();
    if (hexValue) {
      navigator.clipboard.writeText('#' + hexValue).then(() => {
        const originalText = this.colorHex.textContent;
        this.colorHex.textContent = 'COPIED!';
        setTimeout(() => {
          this.colorHex.textContent = originalText;
        }, 1000);
      }).catch(() => {
        // Fallback for older browsers - silently fail
      });
    }
  }

  updateBottleColor(color) {
    const cleanColor = color.replace('#', '');
    this.setColorHexValue(cleanColor);
    
    this.updateBottleBackground().catch(error => {
      console.error('Error updating bottle color:', error);
    });
  }

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      this.showError('Unsupported file type. Please upload a JPG, PNG, or SVG no larger than 50mb for your color reference.');
      this.removeColorImage(); // Reset the field
      return;
    }

    this.hideError(); // Clear any previous errors if valid

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => this.setupColorCanvas(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  setupColorCanvas(img) {
    // Show preview
    this.colorImagePreview?.classList.remove('hidden');
    const wrapperColorImagePreview = this.colorImagePreview.closest('.color-section')
    if (wrapperColorImagePreview) wrapperColorImagePreview.classList.add('uploaded')

    // Calculate canvas size
    const maxWidth = 500;
    const maxHeight = 300;
    let width = img.width;
    let height = img.height;
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    // Set up canvas
    this.colorCanvas.width = width;
    this.colorCanvas.height = height;
    this.canvasContext = this.colorCanvas.getContext('2d');
    this.canvasContext.drawImage(img, 0, 0, width, height);
    this.imageData = this.canvasContext.getImageData(0, 0, width, height);
  }

  handleCanvasMouseMove(e) {
    if (!this.imageData) return;

    this.colorCanvas.classList.add('color-crosshair');

    const rect = this.colorCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (this.colorCanvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (this.colorCanvas.height / rect.height));

    if (x >= 0 && x < this.colorCanvas.width && y >= 0 && y < this.colorCanvas.height) {
      const pixel = this.getPixelColor(x, y);
      const hex = this.rgbToHex(pixel.r, pixel.g, pixel.b);

      // Position tooltip relative to canvas
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      // Show tooltip with better positioning
      this.colorTooltip.textContent = `#${hex}`;
      this.colorTooltip.style.background = `#${hex}`;
      this.colorTooltip.style.color = this.getContrastColor(hex);

      // Position tooltip, but keep it within the viewport
      let tooltipX = canvasX + 15;
      let tooltipY = canvasY - 35;

      // Adjust if tooltip would go outside canvas area
      if (tooltipX + 80 > this.colorCanvas.offsetWidth) {
        tooltipX = canvasX - 85; // Position to the left instead
      }
      if (tooltipY < 0) {
        tooltipY = canvasY + 25; // Position below instead
      }
      this.colorTooltip.style.left = tooltipX + 'px';
      this.colorTooltip.style.top = tooltipY + 'px';
      this.colorTooltip.classList.remove('hidden');
      this.colorTooltip.classList.add('visible');
    } else {
      this.colorTooltip.classList.add('hidden');
      this.colorTooltip.classList.remove('visible');
    }
  }

  handleCanvasMouseLeave() {
    this.colorTooltip?.classList.add('hidden');
    this.colorTooltip?.classList.remove('visible');
    this.colorCanvas?.classList.remove('color-crosshair');
  }

  handleCanvasClick(e) {
    if (!this.imageData) return;

    const rect = this.colorCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (this.colorCanvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (this.colorCanvas.height / rect.height));

    if (x >= 0 && x < this.colorCanvas.width && y >= 0 && y < this.colorCanvas.height) {
      const pixel = this.getPixelColor(x, y);
      const hex = this.rgbToHex(pixel.r, pixel.g, pixel.b);

      // Update color inputs
      this.setColorHexValue(hex);
      this.colorPicker.value = '#' + hex;
      this.updateBottleColor('#' + hex);
      this.userHasSelectedColor = true; // Mark that user has actively selected a color

      // Show marker
      this.colorMarker.style.left = (e.clientX - rect.left) + 'px';
      this.colorMarker.style.top = (e.clientY - rect.top) + 'px';
      this.colorMarker.classList.remove('hidden');
      this.colorMarker.classList.add('visible');

      this.validateForm();
      this.updateStepsState();
    }
  }
  handleTouch(e) {
    e.preventDefault(); 

    if (!this.imageData || e.touches.length === 0) return;

    const touch = e.touches[0];

    const simulatedEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      target: e.target,
      currentTarget: e.currentTarget
    };

    this.handleCanvasClick(simulatedEvent);
  }
  getPixelColor(x, y) {
    const index = (y * this.imageData.width + x) * 4;
    return {
      r: this.imageData.data[index],
      g: this.imageData.data[index + 1],
      b: this.imageData.data[index + 2],
      a: this.imageData.data[index + 3]
    };
  }

  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  getContrastColor(hex) {
    // Calculate luminance to determine if text should be light or dark
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
handleModeChange(mode) {
  this.customizationType = mode;
  
  // Toggle UI visibility
  this.logoContainer.classList.toggle('hidden', mode !== 'logo');
  this.textContainer.classList.toggle('hidden', mode !== 'text');
  
  // Reset previews
  if (mode === 'text') {
    this.logoImage.style.display = 'none';
    this.logoPreviewText.style.display = 'block';
    this.logoPreview?.classList.add('visible');
    const isTextEmpty = (this.customTextValue || '').trim().length === 0;
    this.logoControls?.classList.toggle('hidden', isTextEmpty);  
  } else {
    this.logoImage.style.display = 'block';
    this.logoPreviewText.style.display = 'none';
    // Only show preview if a logo actually exists
    if (!this.currentLogoUrl) {
      this.logoPreview?.classList.remove('visible');
      this.logoControls?.classList.add('hidden');
    }
  }
  this.updateLogoPosition();
}

updateTextPreview() {
  if (this.logoPreviewText) {
    this.logoPreviewText.textContent = this.customTextValue;
    const isTextEmpty = (this.customTextValue || '').trim().length === 0;
    if (this.customizationType === 'text') {
      this.logoControls?.classList.toggle('hidden', isTextEmpty);
    }
    this.logoPreviewText.style.fontFamily = this.fontSelect?.value || 'sans-serif';
    //const sizeMap = { "10": "10px", "14": "14px", "18": "18px" };
    //this.logoPreviewText.style.fontSize = sizeMap[this.fontSizeSelect?.value] || "14px";
    this.updateLogoPosition();
  }
}
  handleLogoUpload(e) {
    const file = e.target.files[0];
    const wrapperEl = e.target.closest('.logo-section')
    if (!file) return;

    // Define allowed types for the Logo (usually no JPG for transparency)
    const allowedTypes = ['image/png', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.type)) {
      this.showError('Unsupported file type. Please upload a PNG or SVG matching the criteria below for your Logo');
      this.removeLogo(); // Reset the field
      return;
    }

    this.hideError(); // Clear any previous errors if valid

    // Store the file for later upload
    this.logoFile = file;

    // Update filename display
    const filenameDisplay = this.querySelector(`#logo-filename-${this.sectionId}`);
    if (filenameDisplay) {
      filenameDisplay.textContent = file.name
    }

    const imageDisplay = this.querySelector(`#logo-preview-image-${this.sectionId}`);
    if (imageDisplay) {
      imageDisplay.innerHTML = ''
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '200px'; // set preview size
      img.width = 100;
      img.height = 100;
      img.style.display = 'block';
      imageDisplay.appendChild(img);
    }
    if (wrapperEl) wrapperEl.classList.add('uploaded')
      this.logoControls?.classList.remove('hidden');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Check minimum dimensions
        if (img.width < 700 || img.height < 700) {
          this.logoWarning?.classList.remove('hidden');
        } else {
          this.logoWarning?.classList.add('hidden');
        }
        // Set logo preview
        this.logoImage.src = event.target.result;
        this.currentLogoUrl = event.target.result;
        this.logoPreview?.classList.add('visible');
        this.logoControls?.classList.remove('hidden');

        this.updateLogoPosition();
        this.updatePercentageDisplays();
        this.validateForm();
        this.updateStepsState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }



  async updateBottleBackground() {
    const color = this.getColorHexValue();

    if (!color || !this.baseProductImage) {
      return;
    }

    // Remove any # prefix and ensure we have a valid hex color
    const cleanColor = color.replace('#', '');
    const hexColor = `#${cleanColor}`;

    try {
      // Check if the image source is an SVG
      if (this.baseProductImageUrl && this.baseProductImageUrl.toLowerCase().includes('.svg')) {
        // Fetch and modify SVG
        await this.updateSVGColor(hexColor);
      } else {
        // Fallback to container background for non-SVG images
        if (this.baseProductImage?.parentElement) {
          this.baseProductImage.parentElement.style.backgroundColor = hexColor;
          this.baseProductImage.parentElement.style.background = hexColor;
        }
      }
    } catch (error) {
      console.error('Error updating bottle color:', error);
      // Fallback to container background
      if (this.baseProductImage?.parentElement) {
        this.baseProductImage.parentElement.style.backgroundColor = hexColor;
        this.baseProductImage.parentElement.style.background = hexColor;
      }
    }
  }

  async updateSVGColor(hexColor) {
    try {
      // Fetch the original SVG
      const response = await fetch(this.baseProductImageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch SVG');
      }

      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      if (svgDoc.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid SVG format');
      }

      // Find elements with fill attributes or CSS classes that should be colored
      const fillableElements = svgDoc.querySelectorAll(
        'path[fill]:not([fill="none"]):not([fill="transparent"]), ' +
        'circle[fill]:not([fill="none"]):not([fill="transparent"]), ' +
        'rect[fill]:not([fill="none"]):not([fill="transparent"]), ' +
        'polygon[fill]:not([fill="none"]):not([fill="transparent"]), ' +
        'ellipse[fill]:not([fill="none"]):not([fill="transparent"]), ' +
        '.background-shape, .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, ' +
        '.bottle-shape, .shape, [class*="shape"], [class*="background"]'
      );

      // Update fill colors
      fillableElements.forEach(element => {
        // Update direct fill attribute
        if (element.hasAttribute('fill') && 
            element.getAttribute('fill') !== 'none' && 
            element.getAttribute('fill') !== 'transparent') {
          element.setAttribute('fill', hexColor);
        }
        
        // Update CSS class-based fills
        if (element.classList.length > 0) {
          // Look for style elements and update CSS
          const styleElements = svgDoc.querySelectorAll('style');
          styleElements.forEach(styleEl => {
            let cssText = styleEl.textContent;
            
            // Update common class patterns - be more specific with regex
            element.classList.forEach(className => {
              // Match class selector with fill property
              const classPattern = new RegExp(`\\.${className}\\s*\\{[^}]*fill\\s*:\\s*[^;}]+`, 'g');
              cssText = cssText.replace(classPattern, (match) => {
                return match.replace(/fill\s*:\s*[^;}]+/, `fill: ${hexColor}`);
              });
              
              // If no existing fill property, add it
              const classBlockPattern = new RegExp(`(\\.${className}\\s*\\{[^}]*)(\\})`, 'g');
              if (!cssText.match(new RegExp(`\\.${className}\\s*\\{[^}]*fill\\s*:`))) {
                cssText = cssText.replace(classBlockPattern, `$1 fill: ${hexColor}; $2`);
              }
            });
            
            styleEl.textContent = cssText;
          });
        }
      });

      // If no fillable elements found, try to add color to the first path element
      if (fillableElements.length === 0) {
        const paths = svgDoc.querySelectorAll('path');
        if (paths.length > 0) {
          paths[0].setAttribute('fill', hexColor);
        }
      }

      // Convert back to string and create blob URL
      const serializer = new XMLSerializer();
      const modifiedSVG = serializer.serializeToString(svgDoc);
      const blob = new Blob([modifiedSVG], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Clean up previous blob URL
      if (this.currentSVGBlobUrl) {
        URL.revokeObjectURL(this.currentSVGBlobUrl);
      }

      // Update image source with modified SVG
      this.baseProductImage.src = url;
      this.currentSVGBlobUrl = url;

    } catch (error) {
      console.error('Error updating SVG color:', error);
      throw error;
    }
  }

  getColorLightness(hex) {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  updatePercentageDisplays() {
    if (this.logoPositionValueEls.length && this.logoPosition) {
      this.setPercentage(this.logoPosition)
      this.logoPositionValueEls.forEach(el => {
        el.textContent = `${Math.round(this.logoPosition.value)}%`;
      })
    }
    if (this.logoSizeValueEls && this.logoSize) {
      this.setPercentage(this.logoSize)
      this.logoSizeValueEls.forEach(el => {
        el.textContent = `${Math.round(this.logoSize.value)}%`;
      })
    }
  }

  setPercentage (e) {
    const min = +e.min || 0, max = +e.max || 100, val = +e.value;
    const percent = ((val - min) * 100) / (max - min);
    e.style.setProperty('--percent', percent + '%');
  }

  updateLogoPosition() {
    const activeElement = this.customizationType === 'text' ? this.logoPreviewText : this.logoImage;
    if (!activeElement || !this.logoPreview) return;

    const positionPercent = parseFloat(this.logoPosition?.value) || 0;
    const sizePercent = parseFloat(this.logoSize?.value) || 50;

    const printableLeft = parseFloat(this.logoPreview?.dataset.printableLeft) || 0;
    const printableTop = parseFloat(this.logoPreview?.dataset.printableTop) || 0;
    const printableRight = parseFloat(this.logoPreview?.dataset.printableRight) || 100;
    const printableBottom = parseFloat(this.logoPreview?.dataset.printableBottom) || 100;

    const printableWidth = printableRight - printableLeft;
    const printableHeight = printableBottom - printableTop;

    // Apply Size
    if (this.customizationType === 'text') {
      // For text, we scale the font-size
      activeElement.style.fontSize = (sizePercent * 0.3) + 'px'; 
      activeElement.style.fontFamily = this.customFont;
      activeElement.style.width = '100%';
    } else {
      // For logos, we scale the width
      const logoSizeInPrintableArea = (sizePercent / 100) * Math.min(printableWidth, printableHeight);
      activeElement.style.width = logoSizeInPrintableArea + '%';
      activeElement.style.height = 'auto';
    }

    // Horizontal Center
    const horizontalCenter = printableLeft + (printableWidth / 2);
    activeElement.style.left = horizontalCenter + '%';
    activeElement.style.transform = 'translateX(-50%)';

    requestAnimationFrame(() => {
      const elementHeight = activeElement.offsetHeight;
      const containerHeight = this.logoPreview.offsetHeight;

      if (elementHeight && containerHeight) {
        const heightPercent = (elementHeight / containerHeight) * 100;
        const heightInPrintableArea = (heightPercent / printableHeight) * 100;
        const maxPosition = Math.max(0, 100 - heightInPrintableArea);

        this.updateSliderConstraints(maxPosition);

        const actualPositionFromBottom = Math.min(positionPercent, maxPosition);
        const actualPositionPercent = (actualPositionFromBottom / 100) * printableHeight;

        const finalTop = printableBottom - actualPositionPercent - heightPercent;
        activeElement.style.top = finalTop + '%';
      }
    });
  }

  updateSliderConstraints(maxPosition) {
    if (!this.logoPosition) return;

    this.logoPosition.max = maxPosition;

    const positionContainer = this.logoPosition.closest('div');
    const labelContainer = positionContainer?.querySelector('.flex.justify-between.text-xs.text-gray-500');

    if (labelContainer) {
      const leftLabel = labelContainer.querySelector('span:first-child');
      const rightLabel = labelContainer.querySelector('span:last-child');

      if (leftLabel) leftLabel.textContent = '0%';
      if (rightLabel) rightLabel.textContent = Math.round(maxPosition) + '%';
    }
  }

  removeLogo() {
    this.logoFile = null;
    this.currentLogoUrl = '';
    
    if (this.logoUpload) this.logoUpload.value = '';
    
    this.logoImage.src = '';
    this.logoPreview?.classList.remove('visible');
    this.logoControls?.classList.add('hidden');
    
    const filenameDisplay = this.querySelector(`#logo-filename-${this.sectionId}`);
    if (filenameDisplay) filenameDisplay.textContent = '';
    
    const imageDisplay = this.querySelector(`#logo-preview-image-${this.sectionId}`);
    if (imageDisplay) imageDisplay.innerHTML = '';

    const wrapperEl = this.logoUpload.closest('.logo-section');
    if (wrapperEl) wrapperEl.classList.remove('uploaded');

    this.validateForm();
  }

  removeColorImage() {
    this.imageData = null;
    if (this.colorImageUpload) this.colorImageUpload.value = '';
    if (this.canvasContext) {
      this.canvasContext.clearRect(0, 0, this.colorCanvas.width, this.colorCanvas.height);
    }
    
    this.colorImagePreview?.classList.add('hidden');
    this.colorMarker?.classList.add('hidden');
    
    const wrapperColorImagePreview = this.colorImagePreview.closest('.color-section');
    if (wrapperColorImagePreview) wrapperColorImagePreview.classList.remove('uploaded');

    this.validateForm();
  }

  getCurrentVariantId() {
    let variantId;
    // check and grab VariantSelect
    if (this.variantSelect && this.variantSelect.value) {
      variantId = this.variantSelect.value;
    } else {
      variantId = this.variantId;
    }
    // variant ID check
    if (!variantId || variantId === '' || variantId === 'undefined' || variantId === 'null') {
      console.warn('No valid variant ID found. variantSelect value:', this.variantSelect?.value, 'fallback variantId:', this.variantId);
      return null;
    }
    return variantId;
  }

  handleVariantChange(e) {
    // Update the current variant
    this.variantId = e.target.value;
    // Re-validate 
    this.validateForm();
  }

  handleQuantityButtonClick(e) {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'increment') {
      this.incrementQuantity();
    } else if (action === 'decrement') {
      this.decrementQuantity();
    }
  }

  handleFileUploadButtonClick(e) {
    const targetId = e.target.dataset.target;
    if (targetId) {
      const input = this.querySelector(`#${targetId}`);
      if (input) {
        input.click();
      }
    }
  }
updateTotalPrice() {
  if (!this.priceDisplay || !this.quantity) return;

  let unitPrice;
  if (this.variantSelect) {
    const selectedOption = this.variantSelect.options[this.variantSelect.selectedIndex];
    unitPrice = parseFloat(selectedOption.dataset.price);
  } else {
    unitPrice = parseFloat(this.priceDisplay.dataset.basePrice);
  }

  const qty = parseInt(this.quantity.value) || 1;
  const totalCents = unitPrice * qty;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  this.priceDisplay.textContent = formatter.format(totalCents / 100);
}
  validateForm() {
    const currentVariantId = this.getCurrentVariantId();
    if (!this.productId || !currentVariantId) {
      if (this.addToCartBtn) this.addToCartBtn.disabled = true;
      if (this.saveBtn) this.saveBtn.disabled = true;
      return;
    }
    
    const colorNameValue = this.colorName?.value?.trim() || '';
    const colorNameValid = colorNameValue.length > 0;

    const quantityValue = parseInt(this.quantity?.value) || 0;
    const quantityValid = quantityValue >= this.minQuantity;

    if (this.decrementButton) this.decrementButton.disabled = quantityValue <= this.minQuantity;
    if (this.quantity && quantityValue < this.minQuantity) this.quantity.value = this.minQuantity

    const acknowledged = this.acknowledgement?.checked === true;

    const colorValue = this.getColorHexValue()?.trim() || '';
    const hasColor = colorValue.length === 6 && /^[A-Fa-f0-9]{6}$/.test(colorValue);

    const allValidForCart = colorNameValid && quantityValid && acknowledged && hasColor;
    const allValidForSave = colorNameValid && acknowledged && hasColor;

    if (this.addToCartBtn) this.addToCartBtn.disabled = !allValidForCart;
    if (this.saveBtn) this.saveBtn.disabled = !allValidForSave;

    if (this.updateStepsState) this.updateStepsState();
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (this.addToCartBtn?.disabled) return;
    this.hideError();
    this.setLoadingState(true);

    try {
      let uploadedLogoUrl = (this.customizationType === 'logo' && this.logoFile) 
      ? await this.uploadLogoImage(this.logoFile) 
      : (this.currentLogoUrl || '');


      this.updateLoadingText('Generating preview...');
      let thumbnailUrl = '';
      try {
        thumbnailUrl = await this.generateCustomizationThumbnail(uploadedLogoUrl);
      } catch (thumbErr) {
        console.warn('Thumbnail API failed, falling back to base image:', thumbErr);
        thumbnailUrl = this.baseProductImageUrl; // Fallback
      }

      this.updateLoadingText('Preparing order...');
      const properties = await this.buildCustomizationProperties({ uploadedLogoUrl, thumbnailUrl });

      console.log("Final Properties being sent to Shopify:", properties);

      this.updateLoadingText('Adding to cart...');
      await this.addToCart(properties);
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showError('Failed to add item to cart. Please try again.');
    } finally {
      this.setLoadingState(false);
      this.validateForm();
    }
  }

  async addToCart(properties) {
    const formData = new FormData();
    const variantId = this.getCurrentVariantId();
    formData.append('id', variantId);
    formData.append('quantity', this.quantity?.value);

    Object.keys(properties).forEach(key => {
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

  async uploadLogoImage(file) {
    if (BB_USE_DUMMY_IMAGE_APIS) {
      // Always return Blank Beauty bottle asset as dummy logo, no base64 or object URLs
      return 'https://blankbeauty.com/cdn/shop/files/BottleAssetsforShopify_6df21070-f9e9-4f70-85f9-b255114a2292.png?v=1713818331';
    }
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.apiBaseUrl}/upload-image`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.file?.url) {
        throw new Error(result.message || 'Upload failed - no URL returned');
      }

      // Ensure the returned URL has HTTPS protocol
      const logoUrl = this.ensureHttpsProtocol(result.file.url);
      return logoUrl;

    } catch (error) {
      console.error('Logo upload error:', error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }
  }

  async generateCustomizationThumbnail(logoImageUrl = '') {
    if (BB_USE_DUMMY_IMAGE_APIS) {
      // Use the Blank Beauty bottle asset as dummy thumbnail
      return 'https://blankbeauty.com/cdn/shop/files/BottleAssetsforShopify_6df21070-f9e9-4f70-85f9-b255114a2292.png?v=1713818331';
    }
    try {
      // Validate base product image URL
      if (!this.baseProductImageUrl) {
        throw new Error('Base product image URL is required for thumbnail generation');
      }

      // Prepare request data for thumbnail generation
      const requestData = {
        baseImageUrl: this.baseProductImageUrl,
        backgroundColor: this.getColorHexValue() || 'ffffff',
        printableArea: {
          top: this.printableTop,
          bottom: this.printableBottom,
          left: this.printableLeft,
          right: this.printableRight
        },
        logoImageUrl: logoImageUrl,
        logoSize: parseInt(this.logoSize?.value || 50),
        logoVerticalPosition: parseInt(this.logoPosition?.value || 0),
        customizationMode: this.customizationType,
        customText: this.customizationType === 'text' ? this.customTextValue : '',
        customFont: this.customizationType === 'text' ? this.customFont : ''
      };

      const response = await fetch(`${this.apiBaseUrl}/generate-thumbnail-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Thumbnail generation failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.file?.url) {
        return this.ensureHttpsProtocol(result.file.url);
      } else {
        throw new Error(result.message || 'API returned success:false');
      }

    } catch (error) {
      console.error('Thumbnail generation error:', error);
      throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
  }

  setLoadingState(loading) {
    if (this.addToCartBtn) {
      this.addToCartBtn.disabled = loading;
    }

    if (this.addToCartText) {
      this.addToCartText.textContent = loading ? 'Processing...' : 'Add to Cart';
    }

    if (this.loadingSpinner) {
      this.loadingSpinner.classList.toggle('hidden', !loading);
    }
  }

  // New: independent save loading state
  setSaveLoadingState(loading, text = '', saved = false) {
    if (this.saveBtn) this.saveBtn.disabled = loading;
    if (this.saveBtnText) this.saveBtnText.textContent = loading || saved ? (text || 'Saving...') : 'Save to my Design';
    if (this.saveBtn) this.saveBtn.classList.toggle('saved', saved);
  }

  /**
   * Save Design flow using Swym Wishlist API. Uploads logo, generates thumbnail,
   * builds properties, ensures the "My Designs" list, and saves the design.
   */
  async handleSaveDesign() {
    if (this.saveBtn?.disabled) return;
    this.hideError();

    try {
      this.setSaveLoadingState(true, 'Uploading assets...');

      // 1. Conditional Logo Upload
      let uploadedLogoUrl = '';
      if (this.customizationType === 'logo' && this.logoFile) {
        uploadedLogoUrl = await this.uploadLogoImage(this.logoFile);
      } else {
        uploadedLogoUrl = this.currentLogoUrl || '';
      }

      // 2. Resilient Thumbnail Generation
      this.setSaveLoadingState(true, 'Generating preview...');
      let thumbnailUrl = '';
      try {
        thumbnailUrl = await this.generateCustomizationThumbnail(uploadedLogoUrl);
      } catch (thumbErr) {
        console.warn('Thumbnail failed, falling back to base image:', thumbErr);
        // Fallback: Use the base product image so the save doesn't break
        thumbnailUrl = this.baseProductImageUrl; 
      }

      // 3. Build properties & Save
      this.setSaveLoadingState(true, 'Saving to wishlist...');
      const properties = await this.buildCustomizationProperties({ uploadedLogoUrl, thumbnailUrl });
      const listId = await this.ensureDesignsWishlist();
      await this.addDesignToSwymList({ listId, properties, thumbnailUrl });

      // 4. Success state
      const editUrl = this.buildEditUrl({ properties });
      this.setSaveLoadingState(false, 'Saved to my Design', true);
      this.showToast('Design saved!', editUrl);

    } catch (err) {
      console.error('Final Save Error:', err);
      this.setSaveLoadingState(false);
      this.showError(err?.message || 'Could not save design.');
    } finally {
      this.validateForm();
    }
  }

  /** Build the line item properties object used for cart and saving. */
  async buildCustomizationProperties({ uploadedLogoUrl = '', thumbnailUrl = '' } = {}) {
    const logoPositionData = await this.calculateLogoPositionRelativeToBottle();
    const printableAreaBottleRelative = this.calculatePrintableAreaRelativeToBottle();
    
    return {
      '_customization_color': this.getColorHexValue(),
      '_customization_color_name': this.colorName?.value,
      '_customization_acknowledged': 'true',
      '_customization_mode': this.customizationType,
      '_customization_text': this.customizationType === 'text' ? this.customTextValue : '',
    '_customization_font': this.customizationType === 'text' ? this.customFont : '',
      '_customization_thumbnail': thumbnailUrl,
      '_customization_logo_url': uploadedLogoUrl,
      '_customization_logo_position': this.logoPosition?.value,
      '_customization_logo_size': this.logoSize?.value,
      '_customization_base_product_image_url': this.baseProductImageUrl || '',
      '_customization_printable_area_top': this.printableTop,
      '_customization_printable_area_bottom': this.printableBottom,
      '_customization_printable_area_left': this.printableLeft,
      '_customization_printable_area_right': this.printableRight,
      // Add printable area bottle-relative positioning data (as percentages relative to bottle)
      '_customization_printable_area_bottle_relative_top': printableAreaBottleRelative.top,
      '_customization_printable_area_bottle_relative_bottom': printableAreaBottleRelative.bottom,
      '_customization_printable_area_bottle_relative_left': printableAreaBottleRelative.left,
      '_customization_printable_area_bottle_relative_right': printableAreaBottleRelative.right,
      '_customization_bottle_coordinates': JSON.stringify(logoPositionData?.bottleCoordinates || {})
    };
  }

  /** Generate a unique design id to distinguish multiple designs. */
  generateDesignId(properties) {
    const base = [
      this.productId,
      this.getCurrentVariantId(),
      properties._customization_color,
      properties._customization_logo_position,
      properties._customization_logo_size,
      (properties._customization_logo_url || '').split('/').pop() || ''
    ].join('|');
    // Simple hash
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash << 5) - hash + base.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }
    const ts = Date.now().toString(36);
    const rnd = Math.random().toString(36).substr(2, 4); // Add random component
    return `bbd_${Math.abs(hash).toString(36)}_${ts}_${rnd}`;
  }

  /** Ensure we have a "My Designs" list that can accept this variant.
   * Since Swym only allows one item per variant per list, we need to find a list
   * that doesn't already contain this variant, or create a new one. */
  async ensureDesignsWishlist() {
    await this.waitForSwym();
    const currentVariantId = this.getCurrentVariantId();
    if (!currentVariantId) {
      throw new Error('Variant ID is required to save design');
    }

    const lists = await this.getSwymLists();

    // Find all "My Designs" lists
    const myDesignsLists = lists.filter(l => {
      // Check by list name or custom attributes
      if (l?.lname?.startsWith('My Designs')) return true;
      if (l?.lprops) {
        const attr = l.lprops['my-designs'];
        return attr === 'true' || attr === true || attr === '1';
      }
      return false;
    });

    // Check each list to see if it already contains this variant
    for (const list of myDesignsLists) {
      try {
        const contents = await this.getListContents(list.lid);
        const hasVariant = contents.some(item =>
          item.epi === currentVariantId ||
          item.empi === currentVariantId ||
          item.cprops?.['product-variant-id'] === currentVariantId
        );

        if (!hasVariant) {
          return list.lid;
        }
      } catch (error) {
        console.warn(`Could not check contents of list ${list.lid}:`, error);
        // Continue to next list
      }
    }

    // All existing lists contain this variant, create a new one
    const listNumber = myDesignsLists.length + 1;
    const listName = listNumber === 1 ? 'My Designs' : `My Designs ${listNumber}`;
    const listPayload = {
      lname: listName,
      lprops: {
        'my-designs': 'true',
        'list-type': 'custom-designs',
        'created-by': 'product-customization',
        'version': '2.0',
        'list-number': String(listNumber)
      }
    };
    const list = await this.createSwymList(listPayload);
    if (!list?.lid) throw new Error('Unable to create wishlist');
    return list.lid;
  }

  /**
   * Create the Swym item payload and add to the specified list.
   * Includes edit URL and all customization data in attributes.
   */
  async addDesignToSwymList({ listId, properties, thumbnailUrl }) {
    await this.waitForSwym();

    // Create a unique design id for each save (always new design)
    const designId = this.generateDesignId(properties);
    const du = this.buildEditUrl({ properties });
    const epi = this.getCurrentVariantId();  // epi = Variant ID (per Swym API docs)
    const empi = this.productId;             // empi = Product ID (per Swym API docs)

    // Validate required fields before creating payload
    if (!epi) {
      throw new Error('Variant ID (epi) is required but not available. Check data-variant-id attribute or variant selector.');
    }
    if (!empi) {
      throw new Error('Product ID (empi) is required but not available. Check data-product-id attribute.');
    }
    if (!du) {
      throw new Error('Detail URL (du) is required but not available');
    }

    // Convert base64 logo URL to dummy URL for custom attributes
    let logoUrlForAttributes = properties._customization_logo_url || '';
    if (logoUrlForAttributes && logoUrlForAttributes.startsWith('data:')) {
      if (BB_USE_DUMMY_IMAGE_APIS) {
        // Use Blank Beauty bottle asset as dummy logo URL for attributes
        logoUrlForAttributes = 'https://blankbeauty.com/cdn/shop/files/BottleAssetsforShopify_6df21070-f9e9-4f70-85f9-b255114a2292.png?v=1713818331';
      } else {
        // In production, we should have uploaded the image and have a real URL
        // If somehow we still have base64, clear it to avoid long attributes
        logoUrlForAttributes = '';
      }
    }

    // Build product payload following Swym API allowed attributes
    const payload = {
      epi,                              // External product ID (required)
      empi,                             // External variant ID (required)
      du,                               // Detail URL (edit URL) (required)
      qty: 1,                           // Quantity (required)
      note: properties._customization_color_name || `Custom Bottle Design - ${designId}`, // Use color name or fallback
      cprops: {
        // Design identification
        'design-id': designId,
        'design-type': 'custom-bottle',
        'created-date': new Date().toISOString(),
        'version': '1.0',

        // Customization data (flattened for easy access)
        'customization-color': properties._customization_color || '',
        'customization-email': properties._customization_email || '',
        'customization-color-name': properties._customization_color_name || '',
        'customization-logo-url': logoUrlForAttributes,
        'customization-logo-position': properties._customization_logo_position || '0',
        'customization-logo-size': properties._customization_logo_size || '50',
        'customization-thumbnail': properties._customization_thumbnail || '',
        'customization-bottle-image': properties._customization_base_product_image_url || '',

        // Product variant information
        'product-variant-id': epi,

        // Printable area configuration
        'printable-area-top': String(properties._customization_printable_area_top || 20),
        'printable-area-bottom': String(properties._customization_printable_area_bottom || 20),
        'printable-area-left': String(properties._customization_printable_area_left || 20),
        'printable-area-right': String(properties._customization_printable_area_right || 20),
        // Complete design JSON for complex operations
        'design-data': JSON.stringify({
          id: designId,
          version: '1.0',
          created: new Date().toISOString(),
          customization: {
            color: properties._customization_color,
            email: properties._customization_email,
            colorName: properties._customization_color_name,
            logo: {
              url: logoUrlForAttributes,
              position: parseFloat(properties._customization_logo_position || 0),
              size: parseFloat(properties._customization_logo_size || 50)
            },
            images: {
              thumbnail: properties._customization_thumbnail,
              bottle: properties._customization_base_product_image_url
            },
            printableArea: {
              top: parseInt(properties._customization_printable_area_top || 20),
              bottom: parseInt(properties._customization_printable_area_bottom || 20),
              left: parseInt(properties._customization_printable_area_left || 20),
              right: parseInt(properties._customization_printable_area_right || 20)
            }
          },
          product: {
            id: this.productId,
            variantId: epi
          }
        }),
        // Legacy compatibility (keep existing format for backwards compatibility)
        'bb-design-id': designId,
        'bb-design': JSON.stringify({
          color: properties._customization_color,
          colorName: properties._customization_color_name,
          logoUrl: logoUrlForAttributes,
          logoPos: properties._customization_logo_position,
          logoSize: properties._customization_logo_size,
          bottleImage: properties._customization_base_product_image_url,
          printable: {
            top: properties._customization_printable_area_top,
            bottom: properties._customization_printable_area_bottom,
            left: properties._customization_printable_area_left,
            right: properties._customization_printable_area_right
          }
        })
      }
    };

    // Use Swym addToList directly with correct parameter format
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.addToList) {
        reject(new Error('addToList API method not available'));
        return;
      }

      // Use the correct parameter format: _swat.addToList(lid, product, onSuccess, onError)
      window._swat.addToList(listId, payload, (result) => {
        resolve(result);
      }, (error) => {
        console.error('addDesignToSwymList error:', error);
        reject(error);
      });
    });
  }

  /**
   * Prefill customization from URL parameters for editing saved designs.
   * Supports color, logoUrl, logoPos, logoSize, and variant.
   */
  applyCustomizationFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params) return;

      // Color (expects hex without #)
      const color = params.get('color');
      if (color && /^[A-Fa-f0-9]{6}$/.test(color)) {
        this.setColorHexValue(color.toUpperCase());
        if (this.colorPicker) this.colorPicker.value = `#${color}`;
        this.updateBottleBackground().catch(error => {
          console.error('Error applying color from URL:', error);
        });
        this.userHasSelectedColor = true; // Color from URL counts as user selection
      }

      // Logo URL
      const logoUrl = params.get('logoUrl');
      if (logoUrl) {
        // Ensure logo URL has HTTPS protocol
        const secureLogoUrl = this.ensureHttpsProtocol(logoUrl);
        this.currentLogoUrl = secureLogoUrl;
        
        if (this.logoImage) this.logoImage.src = secureLogoUrl;
        this.logoPreview?.classList.add('visible');
        this.logoControls?.classList.remove('hidden');
        
        // Remove required attribute from file input since we have a logo from URL
        if (this.logoUpload) {
          this.logoUpload.removeAttribute('required');
        }
      }

      // Logo position and size
      const logoPos = params.get('logoPos');
      if (logoPos !== null && this.logoPosition) {
        const posVal = Math.max(0, Math.min(100, parseFloat(logoPos)));
        this.logoPosition.value = String(isNaN(posVal) ? this.logoPosition.value : posVal);
      }

      const logoSize = params.get('logoSize');
      if (logoSize !== null && this.logoSize) {
        const sizeVal = Math.max(0, Math.min(100, parseFloat(logoSize)));
        this.logoSize.value = String(isNaN(sizeVal) ? this.logoSize.value : sizeVal);
      }

      // Variant (if provided and exists in selector)
      const variantParam = params.get('variant');
      if (variantParam && this.variantSelect) {
        const optionExists = Array.from(this.variantSelect.options || []).some(o => o.value == String(variantParam));
        if (optionExists) {
          this.variantSelect.value = String(variantParam);
          this.variantId = String(variantParam);
          this.variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Email (if provided)
      const email = params.get('email');
      if (email && this.contactEmail) {
        this.contactEmail.value = email;
        // Trigger input event to validate the form
        this.contactEmail.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Color name (if provided)
      const colorName = params.get('colorName');
      if (colorName && this.colorName) {
        this.colorName.value = colorName;
        // Trigger input event to validate the form
        this.colorName.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Apply logo layout if we have a URL
      if (this.currentLogoUrl) {
        this.updateLogoPosition();
      }

      this.updatePercentageDisplays();
      this.validateForm();

      // Handle accordion step based on URL parameters
      // If color is set via URL, expand step 2 instead of step 1
      if (color && /^[A-Fa-f0-9]{6}$/.test(color)) {
        this.setStepExpanded(1, false);
        this.setStepExpanded(2, true);
        this.currentStep = 2;
        this.updateStepsState();
      }
    } catch (e) {
      console.warn('Failed to apply customization from URL', e);
    }
  }

  buildEditUrl({ properties } = {}) {
    try {
      // 1. Start with the full current URL to preserve 'view=wholesale-lp'
      const url = new URL(window.location.href);
      const params = url.searchParams;

      // 2. Identify data source
      const color = properties?._customization_color || this.getColorHexValue();
      const logoUrl = properties?._customization_logo_url || this.currentLogoUrl || '';
      const mode = properties?._customization_mode || this.customizationType;

      // 3. Update the parameters
      params.set('color', (color || '').replace('#', ''));
      params.set('mode', mode);
      params.set('view', 'wholesale-lp'); // Explicitly ensure the tool loads

      if (mode === 'text') {
        params.set('text', properties?._customization_text || this.customTextValue);
        params.set('font', properties?._customization_font || this.fontSelect?.value);
        params.delete('logoUrl'); // Clean up if user switched from logo to text
      } else {
        if (logoUrl && !logoUrl.startsWith('data:')) {
          params.set('logoUrl', logoUrl);
        }
        params.delete('text');
        params.delete('font');
      }

      params.set('logoPos', String(properties?._customization_logo_position || this.logoPosition?.value || '0'));
      params.set('logoSize', String(properties?._customization_logo_size || this.logoSize?.value || '50'));

      return url.toString();
    } catch (e) {
      console.error("URL Build Error", e);
      return window.location.href;
    }
  }

  // === Swym API Integration Methods ===
  //Wait for Swym storefront API. Resolves with window._swat or rejects after timeout.

  waitForSwym(timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (window._swat) return resolve(window._swat);
        if (Date.now() - start > timeoutMs) return reject(new Error('Wishlist service not available'));
        setTimeout(check, 250);
      };
      check();
    });
  }

  /* Fetch  lists for the current shopper (Swym fetchLists). */
  async getSwymLists() {
    await this.waitForSwym();
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.fetchLists) {
        reject(new Error('fetchLists API method not available'));
        return;
      }

      window._swat.fetchLists({
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

  /** Create a new list (uses Swym createList directly). */
  async createSwymList(payload) {
    await this.waitForSwym();
    // Validate required fields
    if (!payload.lname) {
      throw new Error('List name (lname) is required for createList');
    }
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.createList) {
        reject(new Error('createList API method not available'));
        return;
      }

      window._swat.createList(payload, (result) => {
        // Validate the response structure
        if (!result || !result.lid) {
          reject(new Error('Invalid response from createList - missing list ID'));
          return;
        }
        resolve(result);
      }, (error) => {
        console.error('createList error:', error);
        reject(new Error(`Failed to create list: ${error?.message || error}`));
      });
    });
  }

  /** Add items to a list (uses Swym addToList directly). */
  async addToSwymList(listId, product) {
    await this.waitForSwym();
    // Validate required fields for addToList
    if (!listId) {
      throw new Error('List ID is required for addToList');
    }
    if (!product) {
      throw new Error('Product data is required for addToList');
    }
    // Validate product data
    if (!product.epi) {
      throw new Error('External product ID (epi) is required');
    }
    if (!product.empi) {
      throw new Error('External variant ID (empi) is required');
    }
    if (!product.st) {
      throw new Error('Source type (st) is required');
    }
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.addToList) {
        reject(new Error('addToList API method not available'));
        return;
      }

      // Use the correct parameter format: _swat.addToList(lid, product, onSuccess, onError)
      window._swat.addToList(listId, product, (result) => {
        resolve(result);
      }, (error) => {
        console.error('addToList error:', error);
        reject(new Error(`Failed to add to list: ${error?.message || error}`));
      });
    });
  }

  /** Delete items from a list (uses Swym deleteFromList directly). */
  async deleteFromSwymList(payload) {
    await this.waitForSwym();
    // Validate required fields for deleteFromList
    if (!payload.li) {
      throw new Error('List ID (li) is required for deleteFromList');
    }
    if (!payload.d || !Array.isArray(payload.d) || payload.d.length === 0) {
      throw new Error('Data array (d) with at least one item is required for deleteFromList');
    }
    // Validate each item has required identifiers for deletion
    payload.d.forEach((item, index) => {
      if (!item.epi && !item._id) {
        throw new Error(`Item ${index}: Either external product ID (epi) or internal ID (_id) is required for deletion`);
      }
    });
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.deleteFromList) {
        reject(new Error('deleteFromList API method not available'));
        return;
      }

      window._swat.deleteFromList(payload, (result) => {
        resolve(result);
      }, (error) => {
        console.error('deleteFromList error:', error);
        reject(new Error(`Failed to delete from list: ${error?.message || error}`));
      });
    });
  }

  /** Fetch list details (uses Swym fetchListDetails directly). */
  async fetchSwymListDetails(listId) {
    await this.waitForSwym();
    // Validate input
    if (!listId) {
      throw new Error('List ID is required for fetchListDetails');
    }
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.fetchListDetails) {
        reject(new Error('fetchListDetails API method not available'));
        return;
      }

      window._swat.fetchListDetails(listId, (result) => {
        if (!result) {
          reject(new Error('No data returned from fetchListDetails'));
          return;
        }
        resolve(result);
      }, (error) => {
        console.error('fetchListDetails error:', error);
        reject(new Error(`Failed to fetch list details: ${error?.message || error}`));
      });
    });
  }

  /** Fetch list contents (uses Swym fetchListContents directly). */
  async fetchSwymListContents(listId) {
    await this.waitForSwym();
    // Validate input
    if (!listId) {
      throw new Error('List ID is required for fetchListContents');
    }
    return new Promise((resolve, reject) => {
      // Check if the API method exists before calling
      if (!window._swat.fetchListContents) {
        reject(new Error('fetchListContents API method not available'));
        return;
      }

      window._swat.fetchListContents(listId, (result) => {
        if (!result) {
          reject(new Error('No data returned from fetchListContents'));
          return;
        }
        resolve(result);
      }, (error) => {
        console.error('fetchListContents error:', error);
        reject(new Error(`Failed to fetch list contents: ${error?.message || error}`));
      });
    });
  }

  /** Alias for fetchSwymListContents for consistency with method naming */
  async getListContents(listId) {
    const result = await this.fetchSwymListContents(listId);
    // Handle different response structures and return items array
    if (Array.isArray(result)) {
      return result;
    }
    if (result?.items && Array.isArray(result.items)) {
      return result.items;
    }
    if (result?.list?.listcontents && Array.isArray(result.list.listcontents)) {
      return result.list.listcontents;
    }
    return result?.d || [];
  }

  // Utility to update dynamic progress text during cart operations
  updateLoadingText(text) {
    if (this.addToCartText && typeof text === 'string' && text) {
      this.addToCartText.textContent = text;
    }
  }

  // Show an inline error banner
  showError(message) {
    if (this.errorMessage && this.errorText) {
      this.errorText.textContent = message || 'Something went wrong';
      this.errorMessage.classList.remove('hidden');
    } else {
      alert(message || 'Something went wrong');
    }
  }

  // Hide the inline error banner
  hideError() {
    if (this.errorMessage && this.errorText) {
      this.errorText.textContent = '';
      this.errorMessage.classList.add('hidden');
    }
  }

  showToast(message, linkUrl) {
    // Dispatch for the theme's toast system
    const detail = { message, linkUrl };
    document.dispatchEvent(new CustomEvent('bb-toast', { detail }));

    // Fallback: If no custom toast catches it, use a confirm box
    if (linkUrl) {
      const action = confirm(`${message}\n\nClick OK to view or share your design.`);
      if (action) {
        window.location.href = linkUrl;
      }
    } else {
      alert(message);
    }
  } 
  // === Quantity Management ===

  // Quantity helpers used by +/- buttons and validation
  incrementQuantity() {
    if (!this.quantity) return;
    const currentValue = parseInt(this.quantity.value) || this.minQuantity || 1;
    this.quantity.value = currentValue + 1;
    this.updateTotalPrice();
    this.quantity.dispatchEvent(new Event('input'));
  }

  decrementQuantity() {
    if (!this.quantity) return;
    const currentValue = parseInt(this.quantity.value) || this.minQuantity || 1;
    const minQ = this.minQuantity || 1;
    if (currentValue > minQ) {
      this.quantity.value = currentValue - 1;
      this.updateTotalPrice();
      this.quantity.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Validate that the base product image is SVG and can be processed
   */
  async validateBaseProductImage() {
    if (!this.baseProductImageUrl) {
      this.showError('Base product image is required');
      return false;
    }

    try {
      // Check if URL ends with .svg
      if (!this.baseProductImageUrl.toLowerCase().includes('.svg')) {
        this.showError('Base product image must be an SVG file');
        return false;
      }

      // Try to fetch and parse the SVG
      await this.parseBottleCoordinatesFromSVG();
      return true;
    } catch (error) {
      console.error('Error validating base product image:', error);
      this.showError('Error processing base product image. Please ensure it is a valid SVG.');
      return false;
    }
  }

  /**
   * Parse the SVG to find bottle coordinates
   */
  async parseBottleCoordinatesFromSVG() {
    try {
      const response = await fetch(this.baseProductImageUrl);
      if (!response.ok) {
        console.error('Failed to fetch SVG, status:', response.status);
        throw new Error('Failed to fetch SVG');
      }

      const svgText = await response.text();
      
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      if (svgDoc.documentElement.nodeName === 'parsererror') {
        console.error('Invalid SVG format');
        throw new Error('Invalid SVG format');
      }

      // Look for bottle element - this could be a specific ID, class, or element
      // For now, we'll look for common bottle-related identifiers
      const bottleElement = svgDoc.querySelector('#bottle, .bottle, [id*="bottle"], [class*="bottle"], image');
      
      if (bottleElement) {
        // Extract coordinates from the bottle element
        this.bottleCoordinates = this.extractElementCoordinates(bottleElement, svgDoc);
      } else {
        // If no specific bottle element found, use a default area (center of image)
        const svg = svgDoc.documentElement;
        const viewBox = svg.getAttribute('viewBox');
        
        if (viewBox) {
          const [x, y, width, height] = viewBox.split(' ').map(Number);
          
          // Default to center 50% of the image as bottle area
          this.bottleCoordinates = {
            x: x + width * 0.25,
            y: y + height * 0.25,
            width: width * 0.5,
            height: height * 0.5,
            svgWidth: width,
            svgHeight: height
          };
        } else {
          // Fallback coordinates
          this.bottleCoordinates = {
            x: 0.25,
            y: 0.25,
            width: 0.5,
            height: 0.5,
            svgWidth: 1,
            svgHeight: 1
          };
        }
      }
    } catch (error) {
      console.error('Error parsing SVG:', error);
      throw error;
    }
  }

  /**
   * Extract coordinates from an SVG element
   */
  extractElementCoordinates(element, svgDoc) {
    const svg = svgDoc.documentElement;
    const viewBox = svg.getAttribute('viewBox');
    let svgWidth = 100, svgHeight = 100;
    
    if (viewBox) {
      const [x, y, width, height] = viewBox.split(' ').map(Number);
      svgWidth = width;
      svgHeight = height;
    }

    const x = parseFloat(element.getAttribute('x') || '0');
    const y = parseFloat(element.getAttribute('y') || '0');
    const width = parseFloat(element.getAttribute('width') || svgWidth * 0.5);
    const height = parseFloat(element.getAttribute('height') || svgHeight * 0.5);
    
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      svgWidth: svgWidth,
      svgHeight: svgHeight
    };
  }

  /**
   * Calculate printable area coordinates relative to the bottle image (as percentages)
   * This converts the printable area (defined relative to base image) to be relative to bottle only
   */
  calculatePrintableAreaRelativeToBottle() {
    // Ensure bottle coordinates are available
    if (!this.bottleCoordinates) {
      console.warn('Bottle coordinates not available for printable area calculation, using fallback values');
      return {
        left: this.printableLeft,
        top: this.printableTop, 
        right: this.printableRight,
        bottom: this.printableBottom
      };
    }

    // Convert printable area from base image coordinates to bottle coordinates
    // printableTop/Bottom/Left/Right are percentages relative to the base image
    const printableLeft = this.printableLeft / 100; // Convert to 0-1 scale
    const printableTop = this.printableTop / 100;
    const printableRight = this.printableRight / 100;
    const printableBottom = this.printableBottom / 100;

    // Calculate printable area bounds in base image coordinates (0-1 scale)
    const printableAreaBaseImage = {
      left: printableLeft,
      top: printableTop,
      right: 1 - printableRight,
      bottom: 1 - printableBottom,
      width: 1 - printableLeft - printableRight,
      height: 1 - printableTop - printableBottom
    };

    // Calculate bottle bounds in base image coordinates (0-1 scale)
    const bottleInBaseImage = {
      left: this.bottleCoordinates.x / this.bottleCoordinates.svgWidth,
      top: this.bottleCoordinates.y / this.bottleCoordinates.svgHeight,
      right: (this.bottleCoordinates.x + this.bottleCoordinates.width) / this.bottleCoordinates.svgWidth,
      bottom: (this.bottleCoordinates.y + this.bottleCoordinates.height) / this.bottleCoordinates.svgHeight,
      width: this.bottleCoordinates.width / this.bottleCoordinates.svgWidth,
      height: this.bottleCoordinates.height / this.bottleCoordinates.svgHeight
    };

    // Calculate intersection of printable area and bottle area
    const intersectionLeft = Math.max(printableAreaBaseImage.left, bottleInBaseImage.left);
    const intersectionTop = Math.max(printableAreaBaseImage.top, bottleInBaseImage.top);
    const intersectionRight = Math.min(printableAreaBaseImage.right, bottleInBaseImage.right);
    const intersectionBottom = Math.min(printableAreaBaseImage.bottom, bottleInBaseImage.bottom);

    // Convert intersection to bottle-relative coordinates (as percentages)
    const bottleRelativeX = ((intersectionLeft - bottleInBaseImage.left) / bottleInBaseImage.width) * 100;
    const bottleRelativeY = ((intersectionTop - bottleInBaseImage.top) / bottleInBaseImage.height) * 100;
    const bottleRelativeWidth = ((intersectionRight - intersectionLeft) / bottleInBaseImage.width) * 100;
    const bottleRelativeHeight = ((intersectionBottom - intersectionTop) / bottleInBaseImage.height) * 100;

    const result = {
      left: Math.max(0, bottleRelativeX),
      top: Math.max(0, bottleRelativeY),
      right: Math.max(0, 100 - (bottleRelativeX + bottleRelativeWidth)),
      bottom: Math.max(0, 100 - (bottleRelativeY + bottleRelativeHeight))
    };

    return result;
  }

  /**
   * Calculate logo position relative to bottle coordinates
   */
  async calculateLogoPositionRelativeToBottle() {
    // Ensure bottle coordinates are available
    if (!this.bottleCoordinates) {
      console.warn('Bottle coordinates not available, attempting to parse now...');
      try {
        await this.parseBottleCoordinatesFromSVG();
      } catch (error) {
        console.error('Failed to parse bottle coordinates:', error);
        // Set minimal fallback coordinates
        this.bottleCoordinates = {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          svgWidth: 100,
          svgHeight: 100
        };
      }
    }

    if (!this.bottleCoordinates) {
      console.warn('Bottle coordinates still not available after parsing attempt');
      console.warn('baseProductImageUrl:', this.baseProductImageUrl);
      console.warn('Returning null - will result in 0 values for relative positioning');
      return null;
    }

    const logoPosition = parseFloat(this.logoPosition?.value || '0');
    const logoSize = parseFloat(this.logoSize?.value || '50');

    // Get printable area as percentages (convert from 0-100 to 0-1)
    const printableTop = this.printableTop / 100;
    const printableBottom = this.printableBottom / 100;
    const printableLeft = this.printableLeft / 100;
    const printableRight = this.printableRight / 100;

    // Calculate printable area within the bottle coordinates
    const printableAreaX = this.bottleCoordinates.x + (this.bottleCoordinates.width * printableLeft);
    const printableAreaY = this.bottleCoordinates.y + (this.bottleCoordinates.height * printableTop);
    const printableAreaWidth = this.bottleCoordinates.width * (1 - printableLeft - printableRight);
    const printableAreaHeight = this.bottleCoordinates.height * (1 - printableTop - printableBottom);

    // Calculate logo position within the printable area
    const logoWidth = (logoSize / 100) * Math.min(printableAreaWidth, printableAreaHeight);
    const logoHeight = logoWidth; // Assuming square logo for simplicity

    // Position from bottom as percentage of printable area
    const positionFromBottom = logoPosition / 100;
    const logoX = printableAreaX + (printableAreaWidth - logoWidth) / 2; // Centered horizontally
    const logoY = printableAreaY + printableAreaHeight - (positionFromBottom * printableAreaHeight) - logoHeight;

    const result = {
      // Absolute coordinates in SVG units
      absoluteX: logoX,
      absoluteY: logoY,
      absoluteWidth: logoWidth,
      absoluteHeight: logoHeight,
      
      // Relative coordinates to bottle (0-1 scale)
      relativeX: (logoX - this.bottleCoordinates.x) / this.bottleCoordinates.width,
      relativeY: (logoY - this.bottleCoordinates.y) / this.bottleCoordinates.height,
      relativeWidth: logoWidth / this.bottleCoordinates.width,
      relativeHeight: logoHeight / this.bottleCoordinates.height,
      
      // Bottle coordinates for reference
      bottleCoordinates: this.bottleCoordinates
    };

    return result;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Register the custom element
  if (!customElements.get('product-customization')) {
    customElements.define('product-customization', ProductCustomizationComponent);
  }
});

// Global quantity functions (kept for backwards compatibility)
function incrementQuantity(sectionId) {
  const section = document.querySelector(`[data-section-id="${sectionId}"]`);
  const component = section?.closest('product-customization');
  if (component && component.incrementQuantity) {
    component.incrementQuantity();
  } else {
    // Fallback for non-component implementation
    const input = document.getElementById(`quantity-${sectionId}`);
    if (input) {
      const currentValue = parseInt(input.value) || 1;
      input.value = currentValue + 1;
      input.dispatchEvent(new Event('input'));
    }
  }
}

function decrementQuantity(sectionId) {
  const section = document.querySelector(`[data-section-id="${sectionId}"]`);
  const component = section?.closest('product-customization');
  if (component && component.decrementQuantity) {
    component.decrementQuantity();
  } else {
    // Fallback for non-component implementation
    const input = document.getElementById(`quantity-${sectionId}`);
    if (input) {
      const currentValue = parseInt(input.value) || 1;
      const minQuantity = parseInt(input.min) || 1;
      if (currentValue > minQuantity) {
        input.value = currentValue - 1;
        input.dispatchEvent(new Event('input'));
      }
    }
  }
}