import Link from 'next/link'

export default function Logo() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <Link href="/" className="flex items-center justify-center">
        <img src="/logo.png" alt="Logo"   />
      </Link>
    </div>
  )
}