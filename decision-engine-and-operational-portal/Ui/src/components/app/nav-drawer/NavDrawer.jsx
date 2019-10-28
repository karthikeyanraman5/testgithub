import { Drawer, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as PropTypes from "prop-types";
import React from "react";

import routes from "components/app/routes";
import IconNavLink from "components/app/nav-drawer/IconNavLink";
import labels from "pageObjectLabels";

const iconNavLinks = onLinkClick =>
  routes
    .filter(r => r.showInSidebar)
    .map(({ to, label }) => (
      <IconNavLink key={to} to={to} label={label} onClick={onLinkClick} />
    ));

const drawerWidth = 240;

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: {
    width: drawerWidth
  }
});

const NavDrawer = ({ classes, isOpen, onClose }) => (
  <Drawer
    data-label={labels.layout.menu.panel}
    variant="temporary"
    anchor="left"
    className={classes.drawer}
    classes={{
      paper: classes.drawerPaper
    }}
    open={isOpen}
    onClose={onClose}
  >
    <div className={classes.toolbar} />
    <List>{iconNavLinks(onClose)}</List>
  </Drawer>
);

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(NavDrawer);
