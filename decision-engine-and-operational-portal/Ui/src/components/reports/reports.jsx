import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100% - ${theme.mixins.toolbar.height}px)`,
    padding: theme.spacing.unit,
    position: "relative"
  },
  list: {
    height: "100%",
    overflow: "auto"
  }
});

const Reports = ({ match, classes }) => {
  // TODO Won't need this once we have a detailed claims list in place.

  return <Card className={classes.card}></Card>;
};

export default withStyles(styles)(Reports);
