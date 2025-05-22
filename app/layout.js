export const metadata = {
    title: 'Address Book App', 
    description: 'built with Next.js and Firebase'
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}