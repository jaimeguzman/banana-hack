import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center py-4">
      <img src="/logo.png" alt="Logo" className="w-auto h-10" />
    </Link>
  )
}