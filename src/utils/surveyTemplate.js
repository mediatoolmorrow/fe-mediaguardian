// data/surveyTemplate.js
export const surveyTemplate = {
  pages: [
    {
      pageId: 1,
      questions: [
        {
          id: "q1",
          type: "rating",
          label: "คุณพึงพอใจมากแค่ไหน"
        },
        {
          id: "q2",
          type: "rating",
          label: "คุณอยากแนะนำให้ผู้อื่นหรือไม่"
        },
        {
          id: "q3",
          type: "select",
          label: "สิ่งที่คุณชอบมากที่สุด",
          options: ["การออกแบบ", "การใช้งาน", "ความเร็ว", "เนื้อหา"]
        }
      ]
    },
    {
      pageId: 2,
      questions: [
        {
          id: "q4",
          type: "select",
          label: "สิ่งที่ควรปรับปรุง",
          options: ["UI", "Performance", "Feature", "Support"]
        }
      ]
    }
  ]
};
