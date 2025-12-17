import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Product } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useProducts() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const data = await api.products.list()
            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setSelectedProduct(null)
        setIsFormOpen(true)
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsFormOpen(true)
    }

    const handleDelete = async (product: Product) => {
        if (!confirm(`Apakah Anda yakin ingin MENGHAPUS produk "${product.name}" secara permanen? Data yang sudah dihapus tidak dapat dikembalikan.`)) return

        try {
            await api.products.delete(product.id)
            loadProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Gagal menghapus produk')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return {
        router,
        products,
        loading,
        searchQuery,
        setSearchQuery,
        isFormOpen,
        setIsFormOpen,
        selectedProduct,
        loadProducts,
        handleCreate,
        handleEdit,
        handleDelete,
        formatCurrency,
        filteredProducts
    }
}
