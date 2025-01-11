const SocialBanner = () => {
    return (
        <div className="bg-gray-800 text-white py-4 mt-5">
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
                <div className="text-lg font-semibold">
                    <p>
                        Contact Us:{' '}
                        <a href="mailto:leminhoang2004@gmail.com" className="text-blue-400">
                            leminhoang2004@gmail.com
                        </a>
                    </p>
                </div>
                <div className="flex space-x-6">
                    <a href="https://www.facebook.com" className="text-white hover:text-blue-600">
                        <i className="fab fa-facebook"></i>{' '}
                        {/* Use Font Awesome icon or any icon */}
                    </a>
                    <a href="https://www.twitter.com" className="text-white hover:text-blue-400">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com" className="text-white hover:text-pink-400">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default SocialBanner
