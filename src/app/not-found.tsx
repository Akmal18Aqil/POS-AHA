import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-gray-100 p-3">
                <FileQuestion className="h-10 w-10 text-gray-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Halaman Tidak Ditemukan</h2>
                <p className="text-muted-foreground">
                    Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                </p>
            </div>
            <Button asChild>
                <Link href="/">
                    Kembali ke Beranda
                </Link>
            </Button>
        </div>
    )
}
