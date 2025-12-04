import React from "react";
import OrgContactBox from "../components/OrgContactBox";
import ORG_DATA from "../components/data/orgContact.json";

function ContactPage() {
  return (
    <div className="space-y-4">
      {Object.keys(ORG_DATA).map((key) =>
        ORG_DATA[key].map((org, idx) => (
          <OrgContactBox key={key + idx} org={org} />
        ))
      )}
    </div>
  );
}

export default ContactPage;
