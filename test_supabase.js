import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yqtrlqkmitgnaehbawdm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data, error } = await supabase.from('orders').insert({
    id: crypto.randomUUID(),
    customer_name: 'Test',
    customer_email: 'test@example.com',
    customer_phone: '1234567890',
    shipping_address: {},
    items: [],
    subtotal: 100,
    shipping_cost: 0,
    cod_charge: 0,
    discount: 0,
    total: 100,
    status: 'pending',
    payment_method: 'online',
    payment_status: 'pending',
    payment_id: null,
    user_id: 'test'
  }).select()

  if (error) {
    console.error('Insert Error:', error)
  } else {
    console.log('Insert Success:', data)
  }
}

testInsert()
