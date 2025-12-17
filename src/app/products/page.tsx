'use client'

import { useProducts } from '@/hooks/useProducts'
import { ProductListView } from '@/components/products/ProductListView'

export default function ProductsPage() {
    const {
        router,
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
    } = useProducts()

    return (
        <ProductListView
            router={router}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            selectedProduct={selectedProduct}
            loadProducts={loadProducts}
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            formatCurrency={formatCurrency}
            filteredProducts={filteredProducts}
        />
    )
}
