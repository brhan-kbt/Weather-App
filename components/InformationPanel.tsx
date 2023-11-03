import React from 'react'
import CityPicker from './CityPicker'
import weatherCodeToString from '../lib/WeatherCodeToString'
import Image from 'next/image'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
type Props={
    city:any,
    lat:any,
    long:any,
    results:Root | null
}

function InformationPanel({city,lat,long,results}:Props) {
  return (
    <div className=' bg-gradient-to-br from-[#394F68]
    to-[rgb(24,59,123)] p-10'>
        <div className='pb-5'>
            <h1 className='text-4xl text-white font-bold'>{decodeURI(city)}</h1>
            <p className='text-xs text-gray-400'>Long/Lat: {long}, {lat}</p>
        </div>

        <CityPicker/>
        <hr className='mt-8 mb-8 text-gray-300'/>

        <div className='flex justify-between items-center'>
            <div>
                <p className='text-medium text-white '>
                    {
                        new Date().toLocaleDateString("en-GB",{
                            weekday:'long',
                            year:'numeric',
                            month:'long',
                            day:'numeric'
                        })
                    }
                </p>
                <p className='font-extralight text-gray-300'>
                    TimeZone : {
                        Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                </p>
            </div>

            <p className='text-xl font-bold uppercase text-white'>
                {
                    new Date().toLocaleTimeString("en-GB",{
                        hour:"numeric",
                        minute:'numeric',
                        hour12:false
                    })
                }
            </p>
        </div>

        <hr className='mt-8 mb-8 text-gray-300'/>
        {results &&
        <div className='flex items-center justify-between'>
            <div>
                <Image
                src={`https://weatherbit.io/static/img/icons/${
                    weatherCodeToString[results?.current_weather.weathercode].icon
                }.png`}

                alt={weatherCodeToString[results.current_weather.weathercode].label}
                width={75}
                height={75}
                />
                    {/* Image */}
                <div className='text-medium text-white flex items-center justify-between space-x-8'>
                        <p className='text-4xl font-semibold'>
                            {results?.current_weather.temperature} °C
                        </p>
                        <p className='text-right font-extralight text-lg'>
                            {/* Weather Code */}
                            {
                                weatherCodeToString[results?.current_weather.weathercode].label
                            }
                        </p>
                </div>
            </div>
        </div>}

        <div className='pt-5 pb-5'>
            <div className='flex mt-2 items-center space-x-2 px-4 py-3 border
            border-[#6F90CD] rounded-md bg-[#405885]
            '>
                <SunIcon className='h-10 w-10 text-gray-400'/>

                <div className='flex-1 flex justify-between items-center'>
                    <p className='font-extralight text-gray-300'>Sunrise</p>
                    <p className=' text-3xl text-white uppercase'>
                        {results &&
                            new Date(results?.daily.sunrise[0]).toLocaleTimeString("en-GB",{
                                hour:"numeric",
                                minute:"numeric",
                                hour12:true,
                            })
                        }
                    </p>
                </div>

            </div>

            <div className='flex mt-2 items-center space-x-2 px-4 py-3 border
            border-[#6F90CD] rounded-md bg-[#405885]
            '>
                <MoonIcon className='h-10 w-10 text-gray-400'/>

                <div className='flex-1 flex justify-between items-center'>
                    <p className='font-extralight text-gray-300'>Sunset</p>
                    <p className=' text-3xl text-white uppercase'>
                        {results &&
                            new Date(results?.daily.sunset[0]).toLocaleTimeString("en-GB",{
                                hour:"numeric",
                                minute:"numeric",
                                hour12:true,
                            })
                        }
                    </p>
                </div>

            </div>
        </div>
    </div>
  )
}

export default InformationPanel