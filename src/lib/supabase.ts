import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null

import { User, Tenant, Category, Product, Sale, SaleItem, Finance, DashboardStats } from '@/types'

// Re-export for backward compatibility during refactor (optional, but good for now)
export type { User, Tenant, Category, Product, Sale, SaleItem, Finance }


// Auth helper functions
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user data:', JSON.stringify(error, null, 2))
    return null
  }

  return userData
}

export async function getUserTenant(): Promise<Tenant | null> {
  if (!supabase) return null

  const user = await getCurrentUser()

  if (!user) return null

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', user.tenant_id)
    .single()

  if (error) {
    console.error('Error fetching tenant data:', error)
    return null
  }

  return tenant
}

export async function updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating tenant:', error)
    return null
  }

  return data
}

// Category functions (Keeping this as it might not be in API yet)
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}