import { generateCoverLetter } from "@/app/actions";

jest.mock("@google/genai");

import * as genaiMock from "@google/genai";
const mockGeneratedContent = (
  genaiMock as unknown as { mockGenerateContent: jest.Mock }
).mockGenerateContent;

const buildFormData = (opts: { description?: string, resume?: File | null } = {}) => {
  const formData = new FormData()

  if (opts.description !== undefined) {
    formData.append("description", opts.description)
  }
  if (opts.resume !== undefined && opts.resume !== null) {
    formData.append("resume", opts.resume)
  }

  return formData
}
const validResume = new File(["%PDF-1.4 fake pdf content"], "resume.pdf", {
  type: "application/pdf",
});

const emptyResume = new File([], "resume.pdf", { type: "application/pdf" });

const prevState = { coverLetter: null, error: null }

describe("generateCoverLetter", () => {
  it("returns an error when the description is missing", async () => {
    const formData = buildFormData({ resume: validResume })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(null)
    expect(result.error).toMatch(/description/i)
  });

  it("returns an error when the resume is missing", async () => {
    const formData = buildFormData({ description: "SWE role" })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(null)
    expect(result.error).toMatch(/resume/i)
  });

  it("returns an error when the resume file is empty", async () => {
    const formData = buildFormData({ description: "SWE role", resume: emptyResume })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(null)
    expect(result.error).toMatch(/resume/i)
  });

  it("returns the generated cover letter on success", async () => {
    const mockValue = "generated text"
    mockGeneratedContent.mockResolvedValueOnce({ text: mockValue })

    const formData = buildFormData({ description: "SWE role", resume: validResume })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(mockValue)
    expect(result.error).toBe(null)
  });

  it("returns an error when the API responds with no text", async () => {
    mockGeneratedContent.mockResolvedValueOnce({ text: undefined });

    const formData = buildFormData({ description: "SWE role", resume: validResume })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(null)
    expect(result.error).toMatch(/text/i)
  });

  it("returns an error when the API call throws", async () => {
    mockGeneratedContent.mockRejectedValueOnce(new Error("network error"))

    const formData = buildFormData({ description: "SWE role", resume: validResume })

    const result = await generateCoverLetter(prevState, formData)

    expect(result.coverLetter).toBe(null)
    expect(result.error).toMatch(/wrong/i)
  });
});
