'use-client'

import { Country , City} from "country-state-city"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from 'react-select'
import {GlobeIcon} from '@heroicons/react/solid'
type option ={
    value:{
        latitude:string,
        longitude:string,
        isoCode:string,   
    },
    label:string
} | null;



type cityOption ={
    value:{
        latitude:string,
        longitude:string,
        countryCode:string,   
        stateCode:string,   
        name:string,   
    },
    label:string
} | null;
const options = Country.getAllCountries().map(country=>({
    value:{
        latitude:country.latitude,
        longitude:country.longitude,
        isoCode:country.isoCode
    },
    label:country.name
}))

function CityPicker(){
    const [selectedCountry , setSelectedCountry ]= useState<option>(null);
    const [selectedCity , setSelectedCity ]= useState<cityOption>(null);
    const router = useRouter();
    const handleSelctedCountry = (option:option) =>{
        setSelectedCountry(option);
        setSelectedCity(null);
    }

    const handleSelctedCity = (option:cityOption) =>{
        setSelectedCity(option);
         router.push(
             `/location/${option?.value.name}/${option?.value.latitude.trim()}/${option?.value.longitude}`
         )
    }
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                    <GlobeIcon className="h-5 w-5 text-white"/>
                    <label className="text-white/" htmlFor="country">Country</label>
                </div>
                <Select 
                className="text-black"
                value={selectedCountry}
                onChange={handleSelctedCountry}
                options={options}/>
            </div>

            {
                selectedCountry &&
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                    <GlobeIcon className="h-5 w-5 text-white"/>
                    <label className="text-white/" htmlFor="city">City</label>
                </div>
                <Select 
                className="text-black"
                value={selectedCity}
                onChange={handleSelctedCity}
                options={
                        City.getCitiesOfCountry(selectedCountry.value.isoCode)?.map((state)=>({
                            value:{
                                latitude:state.latitude!,
                                longitude:state.longitude!,
                                countryCode:state.countryCode,   
                                stateCode:state.stateCode,   
                                name:state.name,   
                            },
                            label:state.name,
                        }))
                }/>
            </div>
            }
        </div>
    )
}

export default CityPicker