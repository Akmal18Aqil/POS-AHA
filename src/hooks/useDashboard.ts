import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { DashboardStats } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function useDashboard() {
    const { user, tenant, signOut, isOwner } = useAuth()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            try {
                const dashboardStats = await api.dashboard.get()
                setStats(dashboardStats)
            } catch (error) {
                console.error('Error loading dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [])

    return {
        user,
        tenant,
        isOwner,
        stats,
        loading,
        signOut
    }
}
