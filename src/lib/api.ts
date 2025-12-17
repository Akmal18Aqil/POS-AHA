import { Product, Sale, SaleItem, Finance, DashboardStats } from '@/types'

// Helper to handle API responses
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, options)
    const json = await res.json()

    if (!res.ok) {
        throw new Error(json.error || 'An error occurred')
    }

    return json.data
}

export const api = {
    products: {
        list: (category?: string, search?: string) => {
            const params = new URLSearchParams()
            if (category && category !== 'all') params.append('category', category)
            if (search) params.append('search', search)
            return fetchApi<Product[]>(`/api/products?${params.toString()}`)
        },
        create: (product: Partial<Product>) => {
            return fetchApi<Product>('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            })
        },
        update: (id: string, updates: Partial<Product>) => {
            return fetchApi<Product>('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            })
        },
        delete: (id: string) => {
            return fetchApi<{ success: boolean }>(`/api/products?id=${id}`, {
                method: 'DELETE',
            })
        },
    },
    sales: {
        list: (limit = 50, offset = 0) => {
            return fetchApi<Sale[]>(`/api/sales?limit=${limit}&offset=${offset}`)
        },
        create: (sale: Partial<Sale>, items: Partial<SaleItem>[]) => {
            return fetchApi<{ sale: Sale; items: SaleItem[] }>('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sale, items }),
            })
        },
    },
    finance: {
        list: (type?: 'income' | 'expense') => {
            const params = new URLSearchParams()
            if (type) params.append('type', type)
            return fetchApi<Finance[]>(`/api/finance?${params.toString()}`)
        },
        create: (data: Partial<Finance>) => {
            return fetchApi<Finance>('/api/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
        }
    },
    dashboard: {
        get: () => {
            return fetchApi<DashboardStats>('/api/dashboard')
        }
    }
}
