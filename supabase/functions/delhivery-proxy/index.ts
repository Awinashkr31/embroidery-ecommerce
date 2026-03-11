import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()

    if (!action) {
      throw new Error('Missing action')
    }

    const delhiveryToken = Deno.env.get('DELHIVERY_TOKEN')
    if (!delhiveryToken) {
      throw new Error('Delhivery Token not configured')
    }

    if (action === 'checkServiceability') {
      const { pincode } = payload
      if (!pincode) throw new Error('Missing pincode for serviceability check')

      const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${delhiveryToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Delhivery API failed')
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'createOrder') {
      const { orderDetails } = payload
      if (!orderDetails) throw new Error('Missing orderDetails for createOrder')

      const warehouseName = Deno.env.get('DELHIVERY_WAREHOUSE_NAME') || 'Warehouse_Name'

      const delhiveryPayload = {
        "format": "json",
        "data": {
          "shipments": [
            {
              "name": orderDetails.customerName,
              "add": orderDetails.address,
              "pin": orderDetails.pincode,
              "city": orderDetails.city,
              "state": orderDetails.state,
              "country": "India",
              "phone": orderDetails.phone,
              "order": orderDetails.orderId,
              "payment_mode": orderDetails.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
              "mode": orderDetails.mode || 'S',
              "return_pin": "",
              "return_city": "",
              "return_phone": "",
              "return_add": "",
              "products_desc": "Embroidery Items",
              "hsn_code": "",
              "cod_amount": orderDetails.paymentMethod === 'cod' ? orderDetails.amount : 0,
              "order_date": new Date().toISOString(),
              "total_amount": orderDetails.amount,
              "seller_add": "",
              "seller_name": "Enbroidery",
              "seller_inv": "",
              "quantity": orderDetails.items ? orderDetails.items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 1,
              "waybill": "",
              "shipment_width": "10",
              "shipment_height": "10",
              "shipment_depth": "10",
              "shipment_weight": "500"
            }
          ],
          "pickup_location": {
            "name": warehouseName,
            "add": "Warehouse Address",
            "city": "Remote City",
            "pin_code": "110001",
            "country": "India",
            "phone": "9876543210"
          }
        }
      }

      const formData = new URLSearchParams()
      formData.append('format', 'json')
      formData.append('data', JSON.stringify(delhiveryPayload.data))

      const response = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${delhiveryToken}`,
        },
        body: formData
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Delhivery Order Creation Failed: ${errText}`)
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'trackShipment') {
      const { waybill } = payload
      if (!waybill) throw new Error('Missing waybill for tracking')

      const response = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}&token=${delhiveryToken}`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error('Delhivery Tracking API failed')
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
