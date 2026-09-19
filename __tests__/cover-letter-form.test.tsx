import { render, screen } from "@testing-library/react";
import { CoverLetterForm } from "@/app/components/cover-letter-form";
import userEvent from "@testing-library/user-event"

jest.mock("@/app/actions", () => ({
  generateCoverLetter: jest.fn(),
}));
import { generateCoverLetter } from "@/app/actions";

describe("CoverLetterForm", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("keeps the typed description after the form is remounted", async () => {
    const { unmount } = render(<CoverLetterForm />)

    await userEvent.type(screen.getByRole("textbox"), "SWE role")

    unmount()
    render(<CoverLetterForm />)

    expect(screen.getByRole("textbox")).toHaveValue("SWE role")
  });

  it("shows the error message when the action returns an error", async () => {
    jest.mocked(generateCoverLetter).mockResolvedValueOnce(
      {coverLetter: null, error: "error"}
    )
    render(<CoverLetterForm />)
    const button = screen.getByRole("button", {name: "Generate Cover Letter"})
    

    await userEvent.click(button)
    const error = await screen.findByRole("alert")
    expect(error).toBeInTheDocument()
  });

  it("shows the generated cover letter and a Copy button on success", async () => {
    jest.mocked(generateCoverLetter).mockResolvedValueOnce({
      coverLetter: "text", 
      error: null
    })
    render(<CoverLetterForm />)
    
    const button = screen.getByRole("button", {name: "Generate Cover Letter"})

    await userEvent.click(button)
    const coverLetter = await screen.findByRole("article")

    expect(coverLetter).toBeInTheDocument()
  });

});
