import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OrgUnit from "../explore/OrgUnit";
import { findLocation } from "../../data/locations";
import i18n from "@dhis2/d2-i18n";

const CheckPage = () => {
  const { state } = useLocation();

  if (!state) {
    return <div>{i18n.t("Select a location in the left panel")}</div>;
  }

  const location = findLocation(state.id);

  const orgUnit = {
    ...location,
    properties: {
      name: location.displayName,
    },
  };

  console.log("orgUnit", orgUnit);

  return <OrgUnit {...state} orgUnit={orgUnit} />;
};

export default CheckPage;
