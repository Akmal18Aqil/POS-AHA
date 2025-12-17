import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Finance } from '@/lib/supabase'

export interface FinanceFormData {
    type: 'income' | 'expense'
    amount: string
    category: string
    description: string
}

export function useFinance() {
    const [finances, setFinances] = useState<Finance[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState<FinanceFormData>({
        type: 'expense',
        amount: '',
        category: '',
        description: ''
    })

    useEffect(() => {
        loadFinances()
    }, [])

    const loadFinances = async () => {
        setLoading(true)
        try {
            const data = await api.finance.list()
            setFinances(data)
        } catch (error) {
            console.error('Error loading finances:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.amount || !formData.description) {
            alert('Mohon lengkapi data')
            return
        }

        setSubmitting(true)
        try {
            const result = await api.finance.create({
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category || 'Umum',
                description: formData.description
            })

            if (result) {
                setIsFormOpen(false)
                setFormData({
                    type: 'expense',
                    amount: '',
                    category: '',
                    description: ''
                })
                loadFinances()
            } else {
                alert('Gagal menyimpan data')
            }
        } catch (error) {
            console.error('Error saving finance:', error)
            alert('Terjadi kesalahan')
        } finally {
            setSubmitting(false)
        }
    }

    // Calculations
    const totalIncome = finances
        .filter(f => f.type === 'income')
        .reduce((sum, f) => sum + f.amount, 0)

    const totalExpense = finances
        .filter(f => f.type === 'expense')
        .reduce((sum, f) => sum + f.amount, 0)

    const balance = totalIncome - totalExpense

    return {
        finances,
        loading,
        isFormOpen,
        setIsFormOpen,
        submitting,
        formData,
        setFormData,
        handleSubmit,
        summary: {
            totalIncome,
            totalExpense,
            balance
        }
    }
}
