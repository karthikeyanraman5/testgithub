import * as PropTypes from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import labels from "pageObjectLabels";

const handleclick = () => {
  alert("click");
};

const IconNavLink = ({ label, to, location, onClick, className, icon }) => {
  const isSelected = location.pathname && location.pathname === to;

  return (
    <ListItem
      data-label={labels.layout.menu.navLink}
      button
      key={to}
      to={to}
      component={NavLink}
      selected={isSelected}
      onClick={handleclick}
      className={className}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={label} />
    </ListItem>
  );
};

IconNavLink.propTypes = {
  label: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string
};

export default withRouter(IconNavLink);
