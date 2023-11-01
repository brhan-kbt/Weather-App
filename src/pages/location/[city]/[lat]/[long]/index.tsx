import { useRouter } from "next/router";
import { getClient } from "../../../../../../apollo-client";
import fetchWeatherQuery from "../../../../../../graphql/queries/fetchWeatherQueries";
type Props={
  params:{
    city:string,
    lat:string,
    long:string,
  }
}
async function WeatherPage() {
  const router = useRouter();

  const { city, lat, long } = router.query;

  const client = getClient();

  try {
    const {data}= await client.query({
      query:fetchWeatherQuery,
      variables:{
        current_weather:'true',
        daily:"",
        hourly:"",
        latitude:lat,
        longitude:long,
        timezone:'GMT'
      }
    });

    const results :Root =data.myQuery;

    console.log(results);
  } catch (error) {
    console.log('Error here',error)
  }
  




  return (
    <div>Welcome to Weather Page</div>
  )
}

export default WeatherPage