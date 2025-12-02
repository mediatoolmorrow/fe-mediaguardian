import React from "react";

function OptionGrid({ data }) {
  return (
    <div className="space-y-4">
      {data.map((group, index) => (
        <div key={index}>
          <h2 className="optionTopic">{group.topicth}</h2>

          <div className="grid grid-cols-3 flex flex-col items-center gap-4">
            {group.options.map((opt) => (
              <button
                key={opt.value}
                className="promptOption optionText"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OptionGrid;
