// Enhanced Component Loader with Error Handling and Caching

class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Set();
    this.baseUrl = window.location.origin + '/api/preview-689329df426b6e15082df95b/';
  }

  async loadComponent(selector, filePath = null) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return false;
    }

    // Use the data-source attribute if filePath is not provided
    const componentPath = filePath || element.getAttribute('data-source');
    if (!componentPath) {
      console.warn(`No data-source attribute found for: ${selector}`);
      return false;
    }

    // Check cache first
    if (this.cache.has(componentPath)) {
      element.innerHTML = this.cache.get(componentPath);
      return true;
    }

    // Check if already loading
    if (this.loading.has(componentPath)) {
      // Wait for existing load to complete
      while (this.loading.has(componentPath)) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      // Once loaded, check cache again
      if (this.cache.has(componentPath)) {
        element.innerHTML = this.cache.get(componentPath);
        return true;
      }
      return false; // Should not happen if loading completed successfully
    }

    this.loading.add(componentPath);
      
    try {
      const response = await fetch(this.baseUrl + componentPath);
        
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      element.innerHTML = html;
      this.cache.set(componentPath, html); // Cache the loaded content
      return true;
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      
      // Show user-friendly error message
      element.innerHTML = `
        <div class="text-red-500 text-sm p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <i data-lucide="alert-circle" class="w-4 h-4 mr-2"></i>
            <span>Failed to load ${componentPath}</span>
          </div>
          <button onclick="window.componentLoader.retryLoad('${selector}', '${componentPath}')" 
                  class="mt-2 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded">
            Retry
          </button>
        </div>
      `;
      
      // Initialize icons for error message
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      this.loading.delete(componentPath);
      return false;
    }
  }

  async retryLoad(selector, filePath) {
    // Clear cache for this component and retry
    this.cache.delete(filePath);
    this.loading.delete(filePath);
    
    // Retry loading
    return await this.loadComponent(selector, filePath);
  }

  clearCache(componentPath = null) {
    if (componentPath) {
      this.cache.delete(componentPath);
    } else {
      this.cache.clear();
    }
  }

  preloadComponents(componentPaths) {
    return Promise.all(
      componentPaths.map(async path => {
        try {
          const response = await fetch(this.baseUrl + path);
          if (response.ok) {
            const content = await response.text();
            this.cache.set(path, content);
          }
        } catch (error) {
          console.warn(`Failed to preload component: ${path}`);
        }
      })
    );
  }

  // Load multiple components in parallel
  async loadComponents(components) {
    const promises = components.map(({ selector, filePath }) => 
      this.loadComponent(selector, filePath)
    );
    
    return Promise.all(promises);
  }

  // Auto-load all components with data-source attributes
  async autoLoad() {
    const components = document.querySelectorAll('[data-source]');
    const loadPromises = Array.from(components).map(element => {
      const selector = `#${element.id}` || element.tagName.toLowerCase();
      return this.loadComponent(selector);
    });
    
    return Promise.all(loadPromises);
  }

  getCacheStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      cachedComponents: Array.from(this.cache.keys())
    };
  }
}

// Global instance for easy access
if (typeof window !== 'undefined') {
  window.componentLoader = new ComponentLoader();
}

// Named export for ES modules
export async function loadComponent(selector, filePath = null) {
  if (typeof window !== 'undefined' && window.componentLoader) {
    return await window.componentLoader.loadComponent(selector, filePath);
  }
  return false;
}

export async function loadComponents(components) {
  if (typeof window !== 'undefined' && window.componentLoader) {
    return await window.componentLoader.loadComponents(components);
  }
  return false;
}

export async function preloadComponents(componentPaths) {
  if (typeof window !== 'undefined' && window.componentLoader) {
    return await window.componentLoader.preloadComponents(componentPaths);
  }
  return false;
}