import React, { useState } from "react";
import OptionGrid from "../components/optionGrid";
import prompts from "../components/data/promtpOption.json";
import MediaBox from "../components/MediaBox";

const page1 = prompts.page1;
const page2 = prompts.page2;

function PromptPage() {
  const [page, setPage] = useState(2);

  return (
    <div className="max-w-xl mx-auto p-6">
        <MediaBox />
        <div className="mb-4 flex justify-between items-center">
            <h1 className="optionCategory">
            {page === 1 ? "หัวข้อปัญหาที่พบ 1/2" : "ความกังวล 2/2"}
            </h1>

            <span className="text-gray-600">{page}/2</span>
        </div>

        {page === 1 && <OptionGrid data={page1} />}
        {page === 2 && <OptionGrid data={page2} />}

        <div className="mt-6 flex justify-between">
        
        </div>
    </div>
  );
}

export default PromptPage;
