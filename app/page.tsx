import { CoverLetterForm } from "./components/cover-letter-form";

const steps = [
  {
    title: "Paste the job description",
    body: "Drop in the listing you're applying to so the letter can speak directly to what the role needs.",
  },
  {
    title: "Upload your resume",
    body: "Attach a PDF of your resume so the generated letter draws on your real experience, not guesses.",
  },
  {
    title: "Generate and refine",
    body: "Get a tailored draft back in seconds, then copy it out and adjust it to your voice.",
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/yaisnw" },
  { label: "Portfolio", href: "https://yasinwafazada.vercel.app/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yasinwafazada/" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-surface text-surface-foreground font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center text-center py-24 px-16 bg-background text-foreground">
        <h1 className="text-4xl font-semibold text-midnight-violet-600 dark:text-midnight-violet-300">
          Cover Letter Generator
        </h1>
        <p className="max-w-2xl mt-4 text-lg text-foreground/70">
          Turn a job description and your resume into a tailored cover letter
          in seconds.
        </p>
        <div className="w-full max-w-2xl mt-10">
          <CoverLetterForm />
        </div>

        <section className="w-full max-w-3xl mt-24">
          <h2 className="text-3xl font-semibold text-midnight-violet-600 dark:text-midnight-violet-300">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 text-left">
            {steps.map((step, index) => (
              <div key={step.title} className="bg-card text-card-foreground rounded-xl p-6">
                <span className="text-sm font-semibold text-accent">
                  Step {index + 1}
                </span>
                <h3 className="text-xl font-semibold mt-2">{step.title}</h3>
                <p className="mt-2 text-sm text-card-foreground/80">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="flex gap-6 py-8 text-sm text-surface-foreground/70">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </footer>
    </div>
  );
}
