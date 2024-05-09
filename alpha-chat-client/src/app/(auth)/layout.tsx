import React from 'react'
import Image from 'next/image'
import Transition from '@/app/(auth)/template';


const layout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (

        <section className="h-screen flex flex-col  md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0 bg-[#fdfdfd]">

            <div className="md:w-1/3 max-w-sm flex justify-center">
                <Image
                    src="/Thumbnail.gif"
                    alt="Sample image"
                    width={0}
                    height={0}
                    className="w-3/5 md:w-full"
                    // style={{ width: '100%', height: 'auto' }}
                    priority
                />
            </div>

            {children}

        </section>
    )
}

export default layout