import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getClient } from "../../../../../../apollo-client";
import fetchWeatherQuery from "../../../../../../graphql/queries/fetchWeatherQueries";
import CalloutCard from "../../../../../../components/CalloutCard";
import StatCard from "../../../../../../components/StatCard";
import InformationPanel from "../../../../../../components/InformationPanel";
import TempChart from "../../../../../../components/TempChart";
import RainChart from "../../../../../../components/RainChart";
import HumidityChart from "../../../../../../components/HumidityChart";
import getBasePath from "../../../../../../lib/getBasePath";
import cleanData from "../../../../../../lib/cleanData";

export const revalidate = 60;
 function WeatherPage() {
  const [weatherData, setWeatherData] = useState<Root | null>(null);
  const [gptContent, setGptContent] = useState('');
  const router = useRouter();
  const { city, lat, long } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      const { city, lat, long } = router.query;

      if (city && lat && long) {
        const client = getClient();

        try {
          const { data } = await client.query({
            query: fetchWeatherQuery,
            variables: {
              current_weather: 'true',
              latitude: lat,
              longitude: long,
              timezone: 'GMT'
            }
          });

          setWeatherData(data.myQuery);

          const dataToSend = cleanData(data.myQuery, city)
          try {
            const res = await fetch(`${getBasePath()}/api/getWeatherSummary`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                weatherData: dataToSend
              })
            });
          
            if (!res.ok) {
              throw new Error(`Failed to fetch data. Status: ${res.status}`);
            }
          
            const gptData = await res.json(); // Await the JSON conversion
          
            const { content } = gptData;
            setGptContent(content);
          } catch (error) {
            console.error("Error fetching weather summary:", error);
            // Handle the error, set a default content, or show an error message
          }
         
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [router.query]);

 
  // if(weatherData){
  //   const dataToSend = cleanData(weatherData ,city);

  //   const res = await fetch(`${getBasePath()}/api/getWeatherSummary`,{
  //     method: "POST",
  //     headers:{
  //       "Content-Type":"application/json",
  //     },
  //     body:JSON.stringify({
  //       weatherData:dataToSend
  //     })
  //   })

  //   const GPTdata = await res.json();
  //   const {content}=GPTdata;
  // }

  return (
    <div className="flex flex-col min-h-screen md:flex-row">

      {/* InformationalPanel */}
      <InformationPanel city={city} long={long} lat={lat}
      results={weatherData}
      />


      {weatherData && ( // Conditionally render when weatherData is not null
        <div className="flex-1 p-5 lg:p-10">
          <div className="p-5">
            <div className="pb-5">
              <h2 className="text-xl font-bold">Todays Overview</h2>
              <p className="text-sm text-gray-400">
                Last Updated at:{" "}

                {new Date(weatherData.current_weather.time).toLocaleString()}
              </p>
            </div>

            <div className="m-2 mb-10">
              {/* Callout card */}
             <CalloutCard
              message={gptContent}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-2">
              <StatCard
               title="Maximum Temprature"
               metric={`${weatherData.daily.temperature_2m_max[0].toFixed(1)} °`}
               color="yellow"
              />

              <StatCard
               title="Mnimum Temprature"
               metric={`${weatherData.daily.temperature_2m_min[0].toFixed(1)} °`}
               color="green"
              />

            <div>
              <StatCard
               title="UV index"
               metric={`${weatherData.daily.uv_index_max[0].toFixed(1)} °`}
               color="rose"
               />
               {
                 Number(weatherData.daily.uv_index_max[0].toFixed(1))> 4 &&(
                   <CalloutCard
                   warning
                   message={"The UV is high today, be sure to wear SPF!"}/>

                 )
               }

            </div>


              <div className="flex space-x-3">
              <StatCard
               title="Wind Speed"
               metric={`${weatherData.current_weather.windspeed} m/s`}
               color="violet"
              />

              <StatCard
               title="Wind Direction"
               metric={`${weatherData.current_weather.winddirection} °`}
               color="cyan"
              />
              </div>


            </div>
            <hr className="my-5" />

            <div className="space-y-3">
              <TempChart results={weatherData}/>
              <RainChart results={weatherData}/>
              <HumidityChart results={weatherData}/>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default WeatherPage;
