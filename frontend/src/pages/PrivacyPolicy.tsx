import LegalPageLayout from "../components/legal/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 16, 2026">
      <section>
        <h2>Who this covers</h2>
        <p>
          This policy covers VIDYAVERSE, the learning platform at this domain.
          It does not cover other products, which have their own policies.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>When you create an account, we collect:</p>
        <ul>
          <li>Your name and email address.</li>
          <li>Your password, which we never store in plain text — it's hashed before it touches our database.</li>
          <li>Optionally, a GitHub profile URL and a LinkedIn profile URL, if you choose to add them (used to confirm project submissions during AI review, and to enrich your public portfolio).</li>
        </ul>
        <p>
          If you sign in with Google, GitHub, or LinkedIn instead of a password, we receive only the basic
          profile information those providers share (typically your name and email) — we never see or store
          your password on those services.
        </p>
        <p>
          As you use the platform, we also store your course progress, quiz and project submissions, XP and
          streak history, achievements, and any certificates you earn. This is the data the platform needs to
          function — there is no separate hidden tracking beyond what's needed to run your account.
        </p>
      </section>

      <section>
        <h2>How your code is reviewed</h2>
        <p>
          When you submit a project or practice exercise for AI feedback, the code you submitted is sent to a
          third-party AI provider (currently Google Gemini) to generate line-by-line feedback. That's the same
          content you already chose to submit for grading — we don't send anything else about you along with it
          beyond what's needed to process the request.
        </p>
      </section>

      <section>
        <h2>Cookies and sign-in</h2>
        <p>
          We use a small number of cookies and browser storage items, all functional — none for advertising:
        </p>
        <ul>
          <li>A secure, HTTP-only refresh-token cookie that keeps you signed in. It isn't readable by JavaScript on this or any other site.</li>
          <li>A short-lived cookie used only during the OAuth sign-in flow (Google/GitHub/LinkedIn), to confirm the login request came from you.</li>
          <li>An access token and your session state, held in your browser's local storage, cleared automatically when you sign out.</li>
        </ul>
        <p>See our <a href="/cookies">Cookie Policy</a> for the full list.</p>
      </section>

      <section>
        <h2>What we don't do</h2>
        <ul>
          <li>We don't sell your data to anyone.</li>
          <li>We don't run third-party advertising or tracking scripts on this platform.</li>
          <li>We don't share your submitted code or projects publicly unless you explicitly choose to make your portfolio public.</li>
        </ul>
      </section>

      <section>
        <h2>Your certificate and portfolio</h2>
        <p>
          Certificates issued on completion carry a unique verification ID that anyone can check against our
          verification page — that's by design, so employers can confirm it's real. Your broader portfolio
          (projects, courses, skills) is private by default; you control whether it's shared publicly from your
          profile settings.
        </p>
      </section>

      <section>
        <h2>Deleting your data</h2>
        <p>
          You can request account deletion at any time through the platform's contact or support options.
          We'll remove your personal data, submissions, and progress from our systems, other than what we're required to retain for legal or security purposes (for
          example, fraud-prevention records).
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If this policy changes in a way that affects how your data is handled, we'll update the date at the
          top of this page. Since this is currently a draft awaiting legal review, expect it to be revised.
        </p>
      </section>
    </LegalPageLayout>
  );
}
