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
        const type = searchParams.get('type')

        let query = supabase
            .from('finances')
            .select('*')
            .eq('tenant_id', userData.tenant_id)
            .order('created_at', { ascending: false })

        if (type && (type === 'income' || type === 'expense')) {
            query = query.eq('type', type)
        }

        const { data, error } = await query

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

        // Get user's (public) ID and tenant
        const { data: userData } = await supabase
            .from('users')
            .select('id, tenant_id') // Important: Select Public ID
            .eq('auth_id', user.id)
            .single()

        if (!userData?.tenant_id) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
        }

        const body = await request.json()

        if (!body.amount || !body.description || !body.type) {
            return NextResponse.json(
                { error: 'Amount, description, and type are required' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('finances')
            .insert({
                tenant_id: userData.tenant_id,
                type: body.type,
                amount: body.amount,
                category: body.category || 'Umum',
                description: body.description,
                reference_id: body.reference_id || null,
                created_by: userData.id // Use Public User ID
            })
            .select()
            .single()

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
