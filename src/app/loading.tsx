import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" />
                <p className="text-sm text-muted-foreground animate-pulse">Memuat aplikasi...</p>
            </div>
        </div>
    )
}
