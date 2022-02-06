import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, Button } from "@material-ui/core";
import { Formik, Form } from "formik";
import debug from "sabio-debug";
import { useEffect } from "react";
import * as locationService from "../services/locationService";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Grid } from "@material-ui/core";
import Select from "@mui/material/Select";
import { TextField } from "@material-ui/core";
import { PropTypes } from "prop-types";
import { useLocation } from "react-router-dom";
import { REACT_APP_GOOGLE_AUTOCOMPLETE_KEY } from "../services/serviceHelpers";

const logger = debug.extend("locationForm");
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "250px",
    },
  },
}));

export default function AddLocation(props) {
  const [selectedLocation, setLocation] = useState([]);

  const [placeFormData, setPlaceFormData] = useState({
    lineOne: "",
    lineTwo: " ",
    City: "",
    State: "",
    Zip: "",
    locationTypeId: "",
  });
  const location = useLocation();

  useEffect(() => {
    const stateLocation = location.state;
    if (stateLocation && stateLocation.type === "edit")
      setPlaceFormData({
        locationTypeId: stateLocation.payload.loctionTypeId,
        lineOne: stateLocation.payload.lineOne,
        lineTwo: stateLocation.payload.lineTwo,
        City: stateLocation.payload.city,
        State: stateLocation.payload.state,
        Zip: stateLocation.payload.zip,
        id: stateLocation.payload.id,
      });
  }, [location.state || selectedLocation]);

  const onAutoCompleteLoad = (autocomplete) => {
    logger("autocomplete: ", autocomplete);
    setLocation(autocomplete);
  };
  const onAutoCompletePlaceChanged = () => {
    const selectedPlace = selectedLocation.getPlace();
    logger("placechanged", selectedPlace);
    setPlaceFormData((prev) => ({
      ...prev,
      lineOne:
        selectedPlace.address_components[0].long_name +
        " " +
        selectedPlace.address_components[1].long_name,
      City: selectedPlace.address_components[2].long_name,
      State: selectedPlace.address_components[4].short_name,
      Zip: selectedPlace.address_components[6].long_name,
    }));
  };

  const [mapLocationTypes, setLocationTypes] = useState([]);
  useEffect(() => {
    locationService
      .getLocationTypes()
      .then(getLocationTypesSuccess)
      .catch(getLocationTypesError);
  }, []);

  const getLocationTypesSuccess = (response) => {
    logger(response.items);
    setLocationTypes(response.items.map(locationTypesMapper));
  };

  const getLocationTypesError = (response) => {
    logger(response);
  };

  const locationTypesMapper = (locationTypeId) => (
    <MenuItem key={locationTypeId.id} value={locationTypeId.id}>
      {locationTypeId.locationType}
    </MenuItem>
  );

  const onSubmit = (values) => {
    logger("this is our logger");
    const selectedPlace = selectedLocation.getPlace();
    const payload = {
      ...values, //this is for the location type Id
      latitude: selectedPlace.geometry.location.lat(),
      longitude: selectedPlace.geometry.location.lng(),
    };
    if (values.id) {
      logger(values.id);
      locationService.updateLocation(values.id, payload).then().catch();
    } else {
      locationService
        .addLocation(payload)
        .then(addLocationSucess)
        .catch(addLocationError);
    }
  };

  const onClickCancel = () => {
    props.locationToggle(false);
  };

  const classes = useStyles();

  return (
    <div className="d-flex justify-content-center">
      <Formik
        initialValues={placeFormData}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ values, handleChange }) => (
          <Form className={classes.root} noValidate autoComplete="off">
            <Grid container style={{ margin: "15px" }}>
              <Grid item xs={4}>
                <h2>Enter Address</h2>
                <LoadScript
                  googleMapsApiKey={REACT_APP_GOOGLE_AUTOCOMPLETE_KEY}
                  libraries={["places"]}
                >
                  <Autocomplete
                    onLoad={onAutoCompleteLoad}
                    onPlaceChanged={onAutoCompletePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Start typing your address here."
                      onChange={handleChange}
                      name="AutoComplete"
                      style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `95%`,
                        height: `34px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        left: "50%",
                      }}
                    />
                  </Autocomplete>
                </LoadScript>
              </Grid>
              <Grid item xs={2}>
                <h2>Location Type</h2>

                <Select
                  placeholder="Select Location Type"
                  name="locationTypeId"
                  labelId="locationTypeId"
                  id="locationTypeId"
                  value={values.locationTypeId}
                  onChange={handleChange}
                  label="locationTypeId"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `100%`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }}
                >
                  <MenuItem value={""}>none</MenuItem>
                  {mapLocationTypes}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <hr></hr>
                <h2 style={{ marginTop: "18px" }}>Address</h2>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  variant="outlined"
                  fullWidth
                  id="stanard-multiline-flexible"
                  label="Address Line 1"
                  multiline
                  value={values.lineOne}
                  style={{
                    width: "50%",
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                    color: `dark`,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="filled-multiline-flexible"
                  multiline
                  value={"Address Line 2"}
                  fullWidth
                  disabled
                  variant="outlined"
                  style={{ width: "50%" }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="filled-multiline-flexible"
                  label="City"
                  multiline
                  value={values.City}
                  disabled
                  variant="outlined"
                  style={{ width: "98%" }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="filled-multiline-flexible"
                  label="State"
                  multiline
                  value={values.State}
                  disabled
                  variant="outlined"
                  style={{ width: "98%" }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="filled-multiline-flexible"
                  label="Zip"
                  multiline
                  value={values.Zip}
                  disabled
                  variant="outlined"
                  style={{ width: "98%" }}
                />
              </Grid>
              <Grid item xs={8}>
                <Button type="submit">Submit</Button>
                <Button onClick={onClickCancel}>Cancel</Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
}
AddLocation.propTypes = {
  locationToggle: PropTypes.func.isRequred,
  userLocation: PropTypes.number.isRequred,
  location: PropTypes.shape({ state: PropTypes.shape({}) }).isRequred,
};
