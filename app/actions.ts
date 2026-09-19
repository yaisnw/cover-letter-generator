"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const promptPrefix =
  `Generate a professional cover letter tailored to the job description below. 
Use the candidate's resume to highlight relevant experience and skills. 
Keep it concise, under 400 words, and avoid generic phrases. 
Write in first person. Do not include a subject line or date.`;

export type GenerateCoverLetterState = {
  coverLetter: string | null;
  error: string | null;
};

export async function generateCoverLetter(
  _prevState: GenerateCoverLetterState,
  formData: FormData
): Promise<GenerateCoverLetterState> {
  const description = String(formData.get("description") ?? "").trim();
  const resume = formData.get("resume");

  if (!description) {
    return { coverLetter: null, error: "Please enter a job description." };
  }
  if (!(resume instanceof File) || resume.size === 0) {
    return { coverLetter: null, error: "Please upload your resume." };
  }

  let response;
  try {
    const resumeData = Buffer.from(await resume.arrayBuffer()).toString("base64");

    response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `${promptPrefix}\n\nJob description:\n${description}` },
            { inlineData: { mimeType: "application/pdf", data: resumeData } },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("generateCoverLetter failed:", err);
    return {
      coverLetter: null,
      error: "Something went wrong generating your cover letter. Please try again.",
    };
  }

  if (!response.text) {
    return {
      coverLetter: null,
      error: "The generator didn't return any text. Please try again.",
    };
  }

  return { coverLetter: response.text, error: null };
}
