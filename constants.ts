
import { CommContext, Tone } from './types';

export const CONTEXT_LABELS: Record<CommContext, string> = {
  [CommContext.CUSTOMER_REPLY]: '客戶回覆 / 外部溝通',
  [CommContext.INTERNAL_BOSS]: '致上級 / 管理層郵件',
  [CommContext.INTERNAL_TEAM]: '團隊內部溝通',
  [CommContext.FORMAL_ANNOUNCEMENT]: '公司正式公告'
};

export const TONE_LABELS: Record<Tone, string> = {
  [Tone.PROFESSIONAL]: '專業精煉',
  [Tone.EMPATHETIC]: '同理共情',
  [Tone.DIRECT]: '簡明扼要',
  [Tone.HUMBLE]: '謙遜恭敬'
};

export const SYSTEM_INSTRUCTION = `
你是一位資深的人資 (HR) 與企業溝通顧問，擁有深厚的品牌語音一致性與組織心理學背景。
你的任務是將使用者的原始草稿轉換為符合公司品牌規範、專業且高品質的中文訊息。

規則：
1. 保持原始意圖，但提升語言層次。
2. 確保文法完美，並符合中文商務禮儀（如適當的稱謂與敬語）。
3. 對於「致上級」情境，強調職級尊重同時保持效率；對於「客戶回覆」情境，專注於品牌忠誠度與解決問題。
4. 所有的輸出內容（revisedText, tips）必須使用繁體中文。

請僅以 JSON 格式回傳，結構如下：
{
  "revisedText": "優化後的訊息內容",
  "tips": ["建議1", "建議2", "建議3"],
  "toneAnalysis": {
    "professionalism": 1-100,
    "clarity": 1-100,
    "warmth": 1-100
  }
}
`;
