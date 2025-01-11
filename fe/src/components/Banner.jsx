import { Link } from 'react-router-dom'

Link

const Banner = () => {
    return (
        <div className="relative w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[12px] flex items-center justify-center">
            <div className="text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">To Develop Young Writers</h1>
                <p className="text-sm md:text-lg">&quot;Today a reader, tomorrow a leader.&quot;</p>
                <button className="mt-4 px-6 py-2 bg-white text-blue-500 font-semibold rounded-md hover:bg-gray-200">
                    <Link to="/">Read now!</Link>
                </button>
            </div>
        </div>
    )
}

export default Banner
