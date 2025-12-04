import React from "react";

function OrgContactBox({ org }) {
  return (
    <a
      href={org.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border p-4 rounded-xl transition max-h-[186px] max-w-[359px]"
    >
      <div className="flex text-sm justify-start items-center gap-4 p-1">
        <img
          src={org.icon}
          className="rounded-full max-h-18 max-w-18"
          alt={org.name}
        />
        <p className="font-bold">{org.name}</p>
      </div>

      <div className="flex flex-col gap-2 text-xs p-4">
        <p>{org.description}</p>
        <p>Call : {org.call}</p>
      </div>
    </a>
  );
}

export default OrgContactBox;
