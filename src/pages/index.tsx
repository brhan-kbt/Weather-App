import Image from 'next/image'
import { Card,Text,Subtitle, Divider } from '@tremor/react'
import CityPicker from '../../components/CityPicker'


export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center
    min-h-screen p-10
     bg-gradient-to-br from-[#394F68]
     to-[rgb(24,59,123)]'>
      <Card className='max-w-full md:max-w-4xl mx-auto rounded-lg bg-white'>
        <Text className='text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 text-black'>Weather API</Text>
        <Subtitle className='text-xl text-center text-gray-500'>Powered by OpenAI, Nextjs, TailwindCSS, Tremor 2.0, + More</Subtitle>
        <Divider></Divider>
        <Card className='rounded-md bg-gradient-to-br from-[#394F68] to-[#183b7b]'>
          <CityPicker/>
        </Card>
      </Card>
    </main>
  )
}
