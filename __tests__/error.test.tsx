import { render, screen, fireEvent } from "@testing-library/react";
import ErrorFallback from "@/app/error";

describe("Error", () => {
  it("renders a fallback message and a retry button", () => {
    render(<ErrorFallback error={new Error("boom")} retry={() => {}} />)

    const heading = screen.getByRole('heading', {level: 2})
    const button = screen.getByRole("button")

    expect(heading).toHaveTextContent("Something went wrong.")
    expect(button).toHaveTextContent("Try again")
  });

  it("calls retry when the button is clicked", () => {
    const retryMock = jest.fn()
    render(<ErrorFallback error={new Error("boom")} retry={retryMock} />)

    const button = screen.getByRole("button")

    button.click()
    
    expect(retryMock).toHaveBeenCalledTimes(1)

  });
});
