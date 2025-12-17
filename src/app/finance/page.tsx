'use client'

import { useFinance } from '@/hooks/useFinance'
import { FinanceView } from '@/components/finance/FinanceView'

export default function FinancePage() {
    const {
        finances,
        loading,
        isFormOpen,
        setIsFormOpen,
        submitting,
        formData,
        setFormData,
        handleSubmit,
        summary
    } = useFinance()

    return (
        <FinanceView
            finances={finances}
            loading={loading}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            submitting={submitting}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            summary={summary}
        />
    )
}
