export interface User {
    id: string
    auth_id: string
    tenant_id: string
    name: string
    email: string
    phone?: string
    role: 'owner' | 'staff'
    created_at: string
    updated_at: string
}

export interface Tenant {
    id: string
    name: string
    address?: string
    phone?: string
    email?: string
    owner_id: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Category {
    id: string
    tenant_id: string
    name: string
    description?: string
    created_at: string
    updated_at: string
}

export interface Product {
    id: string
    tenant_id: string
    category_id?: string
    name: string
    description?: string
    buy_price: number
    sell_price: number
    stock: number
    min_stock: number
    sku?: string
    barcode?: string
    is_active: boolean
    created_at: string
    updated_at: string
    categories?: Category // relational data
}

export interface Sale {
    id: string
    tenant_id: string
    invoice_number: string
    customer_name?: string
    customer_phone?: string
    total_amount: number
    discount_amount: number
    final_amount: number
    payment_method: 'cash' | 'transfer' | 'card' | 'ewallet'
    payment_status: 'paid' | 'pending' | 'cancelled'
    notes?: string
    created_by?: string
    created_at: string
    updated_at: string
    sale_items?: SaleItem[] // relational data
}

export interface SaleItem {
    id: string
    tenant_id: string
    sale_id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    created_at: string
    updated_at: string
    products?: Product // relational data
}

export interface Finance {
    id: string
    tenant_id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    category?: string
    reference_id?: string
    created_by?: string
    created_at: string
    updated_at: string
}

export interface DashboardStats {
    totalProducts: number
    todaySales: number
    todaySalesCount: number
    monthlyIncome: number
    monthlyExpense: number
    monthlyBalance: number
}
