'use client'

import AuthForm from '@/components/auth/AuthForm'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])

    return (
        <div className="relative">
            <div className="absolute top-4 left-4 z-10">
                <Button variant="ghost" onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
            <AuthForm onSuccess={() => router.push('/')} />
        </div>
    )
}
