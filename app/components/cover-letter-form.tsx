"use client";

import { useActionState, useEffect, useState } from "react";
import { generateCoverLetter, type GenerateCoverLetterState } from "../actions";

const initialState: GenerateCoverLetterState = {
  coverLetter: null,
  error: null,
};

export const DESCRIPTION_STORAGE_KEY = "cover-letter-generator:description";
export const COVER_LETTER_STORAGE_KEY = "cover-letter-generator:cover-letter";

export function CoverLetterForm() {
  const [state, formAction, isPending] = useActionState(
    generateCoverLetter,
    initialState
  );
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [description, setDescription] = useState("");
  const [savedCoverLetter, setSavedCoverLetter] = useState<string | null>(null);

  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from a browser-only store, not derivable during render
    setDescription(localStorage.getItem(DESCRIPTION_STORAGE_KEY) ?? "");
    setSavedCoverLetter(localStorage.getItem(COVER_LETTER_STORAGE_KEY));
  }, []);

  useEffect(() => {
    if (state.coverLetter) {
      localStorage.setItem(COVER_LETTER_STORAGE_KEY, state.coverLetter);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the action result so it persists across reloads
      setSavedCoverLetter(state.coverLetter);
    }
  }, [state.coverLetter]);

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    localStorage.setItem(DESCRIPTION_STORAGE_KEY, e.target.value);
  }

  const coverLetter = state.coverLetter ?? savedCoverLetter;

  async function handleCopy() {
    if (!coverLetter) return;
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy cover letter:", err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  }

  return (
    <div className="w-full">
      <form action={formAction} className="w-full">
        <label className="text-2xl" htmlFor="description">
          Enter your job description to generate a cover letter:
        </label>
        <textarea
          maxLength={5000}
          id="description"
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          className="field-sizing-content w-full min-h-8 max-h-88 resize-none overflow-auto bg-card text-card-foreground my-6 px-8 py-4 rounded-xl"
          placeholder="..."
        />
        <label className="text-2xl">
          Add your resume before continuing: (must be a .pdf file)
        </label>
        <input
          type="file"
          id="fileInput"
          name="resume"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setResumeFileName(e.target.files?.[0]?.name ?? null)}
        />
        <label
          htmlFor="fileInput"
          className="block mx-auto w-54 cursor-pointer rounded-xl bg-accent text-accent-foreground px-6 py-2 my-2"
        >
          {resumeFileName ? `${resumeFileName} is uploaded` : "Upload Resume"}
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground px-6 py-4 text-lg rounded-xl disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>
      {state.error && <p role="alert" className="text-danger mt-4">{state.error}</p>}
      {coverLetter && (
        <div role="article" className="w-full text-left bg-card text-card-foreground my-6 px-8 py-4 rounded-xl">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="text-sm rounded-lg bg-accent text-accent-foreground px-4 py-1.5 cursor-pointer"
            >
              {copied ? "Copied!" : copyError ? "Couldn't copy" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-wrap mt-2">{coverLetter}</p>
        </div>
      )}
    </div>
  );
}
