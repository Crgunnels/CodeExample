import React from "react";
import debug from "sabio-debug";
import { Grid, Card } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { PropTypes } from "prop-types";
import Box from "@mui/material/Box";

const logger = debug.extend("locationForm");

export default function SingleLocation(props) {
  logger("location!!!!", props);

  const onClickEdit = (event) => {
    logger("Edit This", event.currentTarget);
    logger("prop edit info", props);
    props.showOnClickEdit(props.location);
  };

  const onClickDelete = (event) => {
    logger("deleteThis");
    props.showOnClickDelete(props.location, event.currentTarget.id);
  };

  return (
    <Grid item xs={12} sm={4} md={4}>
      <Card style={{ height: "211px" }}>
        <CardContent>
          <Typography
            color="text.primary"
            gutterBottom
            sx={{ textAlign: "center" }}
            className="d-flex pt-3 pb-3 justify-content-center"
          >
            {props.location.locationType}
          </Typography>
          <Typography
            color="text.primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {props.location.lineOne}
          </Typography>
          <Typography
            color="text.primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {props.location.lineTwo}
          </Typography>
          <Typography
            color="text.primary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {props.location.city} {props.location.state} {props.location.zip}
          </Typography>

          <Box
            className="pt-3"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > *": {
                m: 1,
              },
            }}
          >
            <ButtonGroup variant="text" aria-label="text button group">
              <Button onClick={onClickEdit} size="small" id={props.location.id}>
                Edit
              </Button>
              <Button
                size="small"
                onClick={onClickDelete}
                id={props.location.id}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

SingleLocation.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.func.isRequred,
    lineTwo: PropTypes.string.isRequired,
    lineOne: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    locationType: PropTypes.string.isRequired,
  }),
  showOnClickEdit: PropTypes.func.isRequred,
  showOnClickDelete: PropTypes.func.isRequred,
};
