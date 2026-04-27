import { GoogleGenAI, Type } from "@google/genai";

export async function generateBengaliSonnet(userTopic: string) {
  // আপনার দেওয়া কি-টি সরাসরি কোডের ভেতরে যুক্ত করে দেওয়া হলো
  const apiKey = "AIzaSyCTNy6xdGoc8MLeI1guWAncQNwnB4GP6sk";

  const ai = new GoogleGenAI({ apiKey });

  // আপনার দেওয়া সনেট কবিতার নিয়মাবলি
  const SYSTEM_PROMPT = `Role: You are a legendary Bengali poet, an expert in composing flawless Bengali Sonnets (চতুর্দশপদী কবিতা) in the style of Michael Madhusudan Dutt.

Strict Rules You MUST Follow for the Poem:
1. Language Style: Use ONLY pure "Sadhu Bhasha" (সাধু ভাষা). Strictly avoid any "Cholit" (চলিত) forms in the poem.
2. Form Integrity: Strictly avoid mixing Sadhu and Cholit styles in the poem (গুরু-চণ্ডালী দোষ কঠোরভাবে বর্জনীয়).
3. Line Count: The poem MUST be exactly 14 lines long.
4. Stanza Structure: Two stanzas (8+6).
5. Syllable Count (মাত্রা): Every single line MUST have exactly 14 syllables (১৪ অক্ষর).
6. Rhyme Scheme: Classical Madhusudan style (A-B-B-A-A-B-B-A and C-D-C-D-E-E).
7. Spelling & Punctuation: Perfect Bengali spelling and precise punctuation are mandatory.

Rules for the Summary (মুলভাব):
1. Language Style: MUST be in pure "Cholit Bhasha" (চলিত ভাষা).
2. Content: Provide a comprehensive summary that explains the meaning and essence of every line.
3. Output Format: Return a JSON object containing "poem" and "summary".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `বিষয়: ${userTopic}\nউপরের বিষয়ের উপর মাইকেল মধুসূদন দত্তের শৈলীতে বিশুদ্ধ সাধু ভাষায় একটি সনেট এবং পরবর্তীকালে চলিত ভাষায় তার মুলভাব লিখুন।`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poem: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["poem", "summary"]
        }
      },
    });

    if (!response.text) {
      throw new Error("এআই কোনো লেখা তৈরি করতে পারেনি।");
    }

    const data = JSON.parse(response.text);
    return data;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // এপিআই কি ভুল থাকলে বা অন্য সমস্যা হলে মেসেজ
    if (error.message?.includes("API key not valid")) {
      throw new Error("আপনার এপিআই কি-টি সঠিক নয়। দয়া করে চেক করুন।");
    }
    
    throw new Error("কবিতা তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
}
