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

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        // Get all data in parallel
        const [
            productsResult,
            todaySalesResult,
            monthlyFinancesResult
        ] = await Promise.all([
            // Total products
            supabase
                .from('products')
                .select('id', { count: 'exact' })
                .eq('tenant_id', userData.tenant_id)
                .eq('is_active', true)
                .limit(1), // We only need count

            // Today's sales
            supabase
                .from('sales')
                .select('final_amount', { count: 'exact' })
                .eq('tenant_id', userData.tenant_id)
                .eq('payment_status', 'paid')
                .gte('created_at', today.toISOString()),

            // This month's finances
            supabase
                .from('finances')
                .select('amount, type', { count: 'exact' })
                .eq('tenant_id', userData.tenant_id)
                .gte('created_at', startOfMonth.toISOString())
        ])

        const totalProducts = productsResult.count || 0
        const todaySalesData = todaySalesResult.data || []
        const monthlyFinancesData = monthlyFinancesResult.data || []

        const todaySales = todaySalesData.reduce((sum, sale) => sum + sale.final_amount, 0)
        const todaySalesCount = todaySalesResult.count || 0

        const monthlyIncome = monthlyFinancesData
            .filter(f => f.type === 'income')
            .reduce((sum, f) => sum + f.amount, 0)

        const monthlyExpense = monthlyFinancesData
            .filter(f => f.type === 'expense')
            .reduce((sum, f) => sum + f.amount, 0)

        return NextResponse.json({
            data: {
                totalProducts,
                todaySales,
                todaySalesCount,
                monthlyIncome,
                monthlyExpense,
                monthlyBalance: monthlyIncome - monthlyExpense
            }
        })
    } catch (error) {
        console.error('Dashboard API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
