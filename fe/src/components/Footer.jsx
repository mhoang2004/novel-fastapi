function Footer() {
    return (
        <footer className="w-full bg-blue-600 text-white py-6 mt-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    {/* Left Section: Logo/Name */}
                    <a href="/">
                        <h1 className="text-lg font-semibold mb-4 sm:mb-0">Your Novel</h1>
                    </a>

                    {/* Middle Section: Links */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                        <a href="/" className="hover:underline">
                            Home
                        </a>
                        <a href="/about" className="hover:underline">
                            About
                        </a>
                        <a href="/services" className="hover:underline">
                            Upload
                        </a>
                        <a href="/contact" className="hover:underline">
                            Contact
                        </a>
                    </div>

                    {/* Right Section: Copyright */}
                    <p className="text-sm mt-4 sm:mt-0">© {new Date().getFullYear()} YourNovel.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
