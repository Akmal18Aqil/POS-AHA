import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import {
    getCategories,
    Product,
    Category,
    Sale,
    SaleItem
} from '@/lib/supabase'
import { api } from '@/lib/api'

export interface CartItem {
    product: Product
    quantity: number
}

export interface LastSaleData {
    sale: Sale;
    items: (SaleItem & { products: Product })[];
    receivedAmount?: number;
    change?: number;
}

export function usePOS() {
    const router = useRouter()
    const { user, tenant } = useAuth()
    useRequireAuth() // Protect this route

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    // Filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // Cart state
    const [cart, setCart] = useState<CartItem[]>([])

    // Checkout state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'ewallet' | 'card'>('cash')
    const [receivedAmount, setReceivedAmount] = useState('')
    const [processing, setProcessing] = useState(false)
    const [lastSale, setLastSale] = useState<LastSaleData | null>(null)

    // Printer ref
    const componentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [productsData, categoriesData] = await Promise.all([
                api.products.list(),
                getCategories()
            ])
            setProducts(productsData)
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error loading POS data:', error)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (product: Product) => {
        if (product.stock < 1) {
            alert('Stok habis!')
            return
        }

        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                if (existing.quantity + 1 > product.stock) {
                    alert('Stok tidak mencukupi!')
                    return prev
                }
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                return [...prev, { product, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta
                    if (newQty < 1) return item
                    if (newQty > item.product.stock) {
                        alert('Stok limit!')
                        return item
                    }
                    return { ...item, quantity: newQty }
                }
                return item
            })
        })
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.sell_price * item.quantity), 0)

    const handleCheckout = async () => {
        if (!cart.length) return
        setProcessing(true)

        try {
            const finalAmount = subtotal
            const saleData = {
                invoice_number: 'PENDING',
                total_amount: subtotal,
                discount_amount: 0,
                final_amount: finalAmount,
                payment_method: paymentMethod,
                payment_status: 'paid' as const,
            }

            const saleItems = cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.sell_price,
                total_price: item.product.sell_price * item.quantity
            }))

            const result = await api.sales.create(saleData, saleItems)

            if (result) {
                // Prepare data for receipt
                const receiptItems = result.items.map(item => {
                    const product = products.find(p => p.id === item.product_id)
                    return { ...item, products: product! }
                })

                const receivedValue = parseFloat(receivedAmount) || 0
                const changeValue = receivedValue - subtotal

                setLastSale({
                    sale: result.sale,
                    items: receiptItems,
                    receivedAmount: paymentMethod === 'cash' ? receivedValue : undefined,
                    change: paymentMethod === 'cash' ? changeValue : undefined
                })

                // Reset and show success
                setCart([])
                setReceivedAmount('')
                setIsCheckoutOpen(false)
                setIsSuccessOpen(true)

                // Refresh products to show updated stock
                loadData()
            } else {
                alert('Gagal memproses transaksi')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Terjadi kesalahan: ' + (error as Error).message)
        } finally {
            setProcessing(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory
        return matchesSearch && matchesCategory
    })

    const received = parseFloat(receivedAmount) || 0
    const change = received - subtotal

    return {
        router,
        user,
        tenant,
        products,
        categories,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSuccessOpen,
        setIsSuccessOpen,
        paymentMethod,
        setPaymentMethod,
        receivedAmount,
        setReceivedAmount,
        processing,
        lastSale,
        componentRef,
        handleCheckout,
        handlePrint,
        formatCurrency,
        filteredProducts,
        received,
        change
    }
}
