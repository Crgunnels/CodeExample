import React, { useState, useEffect } from "react";
import * as locationService from "../services/locationService";
import debug from "sabio-debug";
import SingleLocation from "./SingleLocation";
import { Grid, Card } from "@material-ui/core";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useHistory } from "react-router-dom";
// import AddLocation from "./AddLocation";

const logger = debug.extend("locationForm");

export default function ViewLocations() {
  const [selectedLocation, setLocation] = useState([]);

  const history = useHistory();
  useEffect(() => {
    locationService
      .getLocation()
      .then(GetLocationSuccess)
      .catch(getLocationError);
  }, []);
  const showOnClickEdit = (userL) => {
    debugger;
    history.push("/AddLocation", { payload: userL, type: "edit" });
  };

  const GetLocationSuccess = (response) => {
    logger("response:", response.item);
    setLocation(response.item.pagedItems.map(locationMapper));
    logger("selectedLocation", selectedLocation);
  };
  const getLocationError = (response) => {
    logger(response);
  };

  const locationMapper = (location) => (
    <React.Fragment key={`location-${location.id}`}>
      <SingleLocation location={location} showOnClickEdit={showOnClickEdit} />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className="p-5 m-5">
        <Typography
          style={{ justifyContent: "center", display: "flex" }}
          sx={{ fontSize: 50 }}
        >
          Your Addresses
        </Typography>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4} md={4}>
              <Link to="/AddLocation">
                <Card style={{ height: "211px" }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      +
                    </Typography>

                    <Typography>Add Address</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            {selectedLocation}
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
}
