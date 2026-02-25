// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

// Supabase configuration - Replace with your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // Products
  async getProducts(filters = {}) {
    let query = supabase.from('products').select('*')
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.featured) {
      query = query.eq('featured', true)
    }
    
    if (filters.active) {
      query = query.eq('active', true)
    }
    
    return await query
  },

  async getProduct(id) {
    return await supabase.from('products').select('*').eq('id', id).single()
  },

  async addProduct(product) {
    return await supabase.from('products').insert(product)
  },

  async updateProduct(id, updates) {
    return await supabase.from('products').update(updates).eq('id', id)
  },

  async deleteProduct(id) {
    return await supabase.from('products').delete().eq('id', id)
  },

  // Orders
  async createOrder(order) {
    return await supabase.from('orders').insert(order)
  },

  async getOrders(userId = null) {
    let query = supabase.from('orders').select('*')
    if (userId) {
      query = query.eq('user_id', userId)
    }
    return await query
  },

  async getOrder(id) {
    return await supabase.from('orders').select('*').eq('id', id).single()
  },

  async updateOrderStatus(id, status) {
    return await supabase.from('orders').update({ status }).eq('id', id)
  },

  // Custom Requests
  async createCustomRequest(request) {
    return await supabase.from('custom_requests').insert(request)
  },

  async getCustomRequests() {
    return await supabase.from('custom_requests').select('*').order('created_at', { ascending: false })
  },

  async updateCustomRequestStatus(id, status) {
    return await supabase.from('custom_requests').update({ status }).eq('id', id)
  },

  // Mehndi Bookings
  async createMehndiBooking(booking) {
    return await supabase.from('mehndi_bookings').insert(booking)
  },

  async getMehndiBookings() {
    return await supabase.from('mehndi_bookings').select('*').order('date', { ascending: true })
  },

  async updateBookingStatus(id, status) {
    return await supabase.from('mehndi_bookings').update({ status }).eq('id', id)
  },

  // Contact Messages
  async createMessage(message) {
    return await supabase.from('messages').insert(message)
  },

  async getMessages() {
    return await supabase.from('messages').select('*').order('created_at', { ascending: false })
  },

  async markMessageAsRead(id) {
    return await supabase.from('messages').update({ read: true }).eq('id', id)
  },

  // Gallery Images
  async getGalleryImages(category = null) {
    let query = supabase.from('gallery').select('*')
    if (category) {
      query = query.eq('category', category)
    }
    return await query.order('created_at', { ascending: false })
  },

  async addGalleryImage(image) {
    return await supabase.from('gallery').insert(image)
  },

  async deleteGalleryImage(id) {
    return await supabase.from('gallery').delete().eq('id', id)
  },

  // Newsletter Subscriptions
  async subscribeNewsletter(email) {
    return await supabase.from('newsletter_subscriptions').insert({ email })
  },

  // User Authentication
  async signUp(email, password) {
    return await supabase.auth.signUp({ email, password })
  },

  async signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    return await supabase.auth.signOut()
  },

  async getCurrentUser() {
    return await supabase.auth.getUser()
  }
}

// File upload helper
export async function uploadFile(file, bucket = 'images', folder = '') {
  const fileName = `${folder}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)
    
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
    
  return publicUrl
}

// Real-time subscriptions
export function subscribeToOrders(callback) {
  return supabase
    .channel('orders')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        callback)
    .subscribe()
}

export function subscribeToMessages(callback) {
  return supabase
    .channel('messages')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' }, 
        callback)
    .subscribe()
}

// Export supabase client as default
export default supabase