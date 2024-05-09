import Image from 'next/image'

const Loading = () => {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Image
                src="/Loading.gif"
                alt="Loading"
                width={0}
                height={0}
                className="w-12"
                priority
            />
        </div>
    )
}
export default Loading