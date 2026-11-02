import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 16, 2026">
      <section>
        <h2>The short version</h2>
        <p>
          VIDYAVERSE gives you access to project-based courses, an in-browser IDE, AI-reviewed project
          submissions, and — if you complete a course — a verifiable certificate. Use it to learn and build; don't
          use it to cheat, abuse, or resell access.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>You're responsible for keeping your password (or OAuth account) secure, and for activity under your account.</li>
          <li>One account per person. Accounts aren't transferable.</li>
          <li>You must be old enough to legally agree to these terms in your country, or have a parent/guardian's consent.</li>
        </ul>
      </section>

      <section>
        <h2>What you submit</h2>
        <p>
          Code, projects, and answers you submit remain yours. By submitting them, you give us permission to
          store them, run them through automated review (including sending them to a third-party AI provider for
          feedback), and display them back to you as part of your portfolio and progress history.
        </p>
        <p>
          Don't submit someone else's work as your own. Project submissions are cross-checked (including against
          the GitHub profile URL you provide) specifically to keep AI review and certificates meaningful — for
          you and for anyone who later trusts your certificate.
        </p>
      </section>

      <section>
        <h2>Certificates</h2>
        <p>
          A certificate is issued only after you've completed a course's requirements, including any AI-reviewed
          project work. Certificates carry a unique verification ID intended to be checked by third parties (like
          employers). We reserve the right to revoke a certificate if we later determine it was obtained through
          plagiarized work or account misuse — in that case, the verification page will reflect the revoked status
          rather than silently disappearing.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>Don't:</p>
        <ul>
          <li>Attempt to bypass, automate, or abuse the AI review or certificate system.</li>
          <li>Use the platform to build or test malicious code intended to harm others.</li>
          <li>Scrape, resell, or redistribute course content without permission.</li>
          <li>Share your account credentials or let someone else complete coursework under your identity.</li>
        </ul>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          We aim for the platform to be reliably available, but we don't guarantee uninterrupted access — things
          like maintenance, third-party outages (including the AI providers we depend on for code review), or
          unforeseen issues can cause downtime.
        </p>
      </section>

      <section>
        <h2>Ending your account</h2>
        <p>
          You can stop using the platform and request account deletion at any time — see our{" "}
          <a href="/privacy">Privacy Policy</a> for how. We may suspend or terminate accounts that violate the
          acceptable-use terms above, generally with notice unless the violation is severe (e.g. security abuse).
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          These terms are a draft, written to plainly describe how the platform actually works today rather than
          generic boilerplate — but they haven't been reviewed by a lawyer yet. If something here seems unclear
          or wrong, reach out through the platform's contact or support options.
        </p>
      </section>
    </LegalPageLayout>
  );
}
