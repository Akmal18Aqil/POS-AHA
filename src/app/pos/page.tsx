'use client'

import { usePOS } from '@/hooks/usePOS'
import { POSView } from '@/components/pos/POSView'

export default function POSPage() {
    const {
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
    } = usePOS()

    return (
        <POSView
            router={router}
            user={user}
            tenant={tenant}
            products={products}
            categories={categories}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            subtotal={subtotal}
            isCheckoutOpen={isCheckoutOpen}
            setIsCheckoutOpen={setIsCheckoutOpen}
            isSuccessOpen={isSuccessOpen}
            setIsSuccessOpen={setIsSuccessOpen}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            receivedAmount={receivedAmount}
            setReceivedAmount={setReceivedAmount}
            processing={processing}
            lastSale={lastSale}
            componentRef={componentRef}
            handleCheckout={handleCheckout}
            handlePrint={handlePrint}
            formatCurrency={formatCurrency}
            filteredProducts={filteredProducts}
            received={received}
            change={change}
        />
    )
}
