/* eslint-disable react/prop-types */

import { useState } from 'react'
const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleAccordion = () => setIsOpen(!isOpen)

    return (
        <div className="w-full max-w-lg mx-auto mb-4">
            <div className="bg-gray-200 p-4 rounded-t-lg cursor-pointer" onClick={toggleAccordion}>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            {isOpen && (
                <div className="bg-gray-100 p-4 border-t-2 border-gray-300 rounded-b-lg">
                    <p>{content}</p>
                </div>
            )}
        </div>
    )
}

export default Accordion
