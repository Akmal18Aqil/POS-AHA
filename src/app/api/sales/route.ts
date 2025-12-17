import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's tenant
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('auth_id', user.id)
      .single()

    if (!userData?.tenant_id) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          *,
          products (*)
        )
      `)
      .eq('tenant_id', userData.tenant_id) // Explicit tenant check
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's tenant
    const { data: userData } = await supabase
      .from('users')
      .select('id, tenant_id') // Select ID as well
      .eq('auth_id', user.id)
      .single()

    if (!userData?.tenant_id) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const { sale, items } = await request.json()

    // Validation
    if (!sale || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Sale data and items are required' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Each item must have product_id, quantity, and unit_price' },
          { status: 400 }
        )
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Item quantity must be greater than 0' },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const totalAmount = items.reduce((sum: number, item: any) =>
      sum + (item.quantity * item.unit_price), 0
    )

    const discountAmount = sale.discount_amount || 0
    const finalAmount = totalAmount - discountAmount

    // Create sale
    const { data: newSale, error: saleError } = await supabase
      .from('sales')
      .insert({
        tenant_id: userData.tenant_id,
        customer_name: sale.customer_name?.trim() || null,
        customer_phone: sale.customer_phone?.trim() || null,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        payment_method: sale.payment_method || 'cash',
        payment_status: sale.payment_status || 'paid',
        notes: sale.notes?.trim() || null,
        created_by: userData.id // Use Public User ID
      })
      .select()
      .single()

    if (saleError) {
      return NextResponse.json(
        { error: saleError.message },
        { status: 400 }
      )
    }

    // Create sale items
    const saleItems = items.map((item: any) => ({
      tenant_id: userData.tenant_id,
      sale_id: newSale.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    const { data: newItems, error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems)
      .select(`
        *,
        products (*)
      `)

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 400 }
      )
    }

    // Create finance record for income
    const { error: financeError } = await supabase
      .from('finances')
      .insert({
        tenant_id: userData.tenant_id,
        type: 'income',
        amount: finalAmount,
        description: `Penjualan - ${newSale.invoice_number} (${newSale.payment_method})`,
        category: 'Penjualan', // Standardized category
        reference_id: newSale.id,
        created_by: userData.id // Use Public User ID
      })

    if (financeError) {
      console.error('Error creating finance record:', financeError)
      // Don't fail the sale if finance record creation fails
    }

    return NextResponse.json({
      data: {
        sale: newSale,
        items: newItems
      }
    })
  } catch (error) {
    console.error('Sales API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}