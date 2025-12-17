'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error caught:', error)
    }, [error])

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Terjadi Kesalahan</h2>
                <p className="text-muted-foreground max-w-[500px]">
                    Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.
                </p>
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 font-mono">
                    {error.message || "Unknown error"}
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Ke Beranda
                </Button>
                <Button onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }>
                    Coba Lagi
                </Button>
            </div>
        </div>
    )
}
