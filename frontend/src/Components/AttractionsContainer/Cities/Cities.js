import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "reactstrap/es/Button";
import "./Cities.scss";
import Spinner from "reactstrap/es/Spinner";

const Cities = ({chooseCity}) => {

    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);

    const loadCities = async () => {
        const {data} = await axios.get("/api/v1/cities");
        setCities(data.cities)
    };

    useEffect(() => {
        setLoading(true);
        loadCities();
        setLoading(false);
    }, []);

    const citiesList = cities.map(city => {
            return (
                <div key={city.city_id}  className={"city-container"}>
                    <Button block={true} className={"action-button"} onClick={() => chooseCity(city)}>
                        {city.city_name}
                    </Button>
                </div>
            )
        }
    );

    return (
        <div id={"cities"}>
            <h1 className={"text-header-important"}>Choose a City</h1>
            <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
                {loading ?
                    <Spinner color="danger"/>
                    :
                    citiesList
                }
            </div>
        </div>)
};

export default Cities;

