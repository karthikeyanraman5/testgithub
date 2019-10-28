import { AssignmentInd } from "@material-ui/icons";
import React from "react";
import Reports from "components/reports";

export default [
  {
    path: "/",
    to: "/",
    label: "Report",
    icon: <AssignmentInd />,
    component: Reports,
    isDefault: true,
    showInSidebar: true,
    exact: true
  }
];
