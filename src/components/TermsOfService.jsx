import Footer from "./Footer";
import SEO from "./SEO";
import "./TermsOfService.css";

const lastUpdated = "1.0.0";

function goBack(event) {
  if (window.history.length > 1) {
    event.preventDefault();
    window.history.back();
  }
}

export default function TermsOfService() {
  return (
    <div className="tos-page">
      <SEO
        title="Terms of Service — SenPlay"
        description="Terms of Service for SenPlay."
        path="/terms"
      />

      <header className="tos-topbar">
        <div className="tos-topbar__inner">
          <a href="/" onClick={goBack} className="tos-topbar__back">
            ← Back
          </a>
          <a href="/" className="tos-topbar__logo">
            <span aria-hidden="true">▶</span> SenPlay
          </a>
        </div>
      </header>

      <main className="tos">
        <div className="tos__container">
          <div className="tos__header">
            <p className="tos__eyebrow">TERMS OF SERVICE</p>
            <p className="tos__brand">SenPlay</p>
            <h1 className="tos__heading">Terms of Service</h1>
            <p className="tos__intro">
              Please read these terms carefully before using SenPlay.
            </p>
            <p className="tos__updated">Last Version: {lastUpdated}</p>
          </div>

          <div className="tos__divider" role="presentation" />

          <div className="tos__content">
            <section className="tos__section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using SenPlay, you agree to be bound by these
                Terms of Service. If you do not agree with any part of these
                terms, please do not use the Service.
              </p>
            </section>

            <section className="tos__section">
              <h2>2. About SenPlay</h2>
              <p>
                SenPlay is an entertainment platform that helps you discover and
                enjoy different kinds of content, including but not limited to
                anime, donghua, comics, movies, and other entertainment
                categories made available on the platform from time to time.
              </p>
            </section>

            <section className="tos__section">
              <h2>3. Eligibility</h2>
              <p>
                You must be legally permitted to use the Service under the laws
                applicable to you. By using SenPlay, you represent that you meet
                this requirement.
              </p>
            </section>

            <section className="tos__section">
              <h2>4. User Accounts</h2>
              <p>
                If SenPlay allows you to create an account, you are responsible
                for the accuracy of your account information, for keeping your
                account secure, and for all activity that occurs through your
                account.
              </p>
            </section>

            <section className="tos__section">
              <h2>5. Acceptable Use</h2>
              <p>You agree not to use SenPlay to:</p>
              <ul>
                <li>Engage in any unlawful activity;</li>
                <li>Misuse or abuse the Service in any way;</li>
                <li>Attempt to gain unauthorized access to the Service;</li>
                <li>Interfere with or disrupt the Service or its systems;</li>
                <li>Abuse the Service's API or servers; or</li>
                <li>
                  Engage in activity that could harm other users or the Service.
                </li>
              </ul>
            </section>

            <section className="tos__section">
              <h2>6. Content</h2>
              <p>
                SenPlay may display, link to, embed, or provide access to
                content and information from various sources. The availability
                of any particular content may change at any time without notice.
              </p>
            </section>

            <section className="tos__section">
              <h2>7. Intellectual Property</h2>
              <p>
                The SenPlay branding, logo, website, application, design, and
                software are the property of SenPlay or its respective owners,
                except where stated otherwise. This does not extend to
                third-party content made available through the Service.
              </p>
            </section>

            <section className="tos__section">
              <h2>8. Third-Party Services and Links</h2>
              <p>
                SenPlay may use or direct you to third-party services. SenPlay
                is not responsible for the availability, content, changes,
                terms, or privacy practices of any third-party service.
              </p>
            </section>

            <section className="tos__section">
              <h2>9. Availability of the Service</h2>
              <p>
                We aim to keep SenPlay available, but we do not guarantee that
                the Service will always be available, uninterrupted, or free of
                errors. The Service may be affected by maintenance or other
                changes from time to time.
              </p>
            </section>

            <section className="tos__section">
              <h2>10. Disclaimer</h2>
              <p>
                The Service is provided on an "as is" and "as available" basis,
                without warranties of any kind, to the extent permitted by
                applicable law.
              </p>
            </section>

            <section className="tos__section">
              <h2>11. Limitation of Liability</h2>
              <p>
                To the extent permitted by applicable law, SenPlay shall not be
                liable for any indirect, incidental, or consequential damages
                arising from your use of the Service.
              </p>
            </section>

            <section className="tos__section">
              <h2>12. Changes to the Service</h2>
              <p>
                SenPlay may change, update, add, or remove features of the
                Service at any time.
              </p>
            </section>

            <section className="tos__section">
              <h2>13. Changes to These Terms</h2>
              <p>
                These Terms of Service may be updated from time to time. The
                "Last updated" date above will reflect the date of the most
                recent significant change.
              </p>
            </section>

            <section className="tos__section">
              <h2>14. Termination</h2>
              <p>
                Your access to the Service may be limited or terminated if you
                violate these Terms, or for other operational or legal reasons.
              </p>
            </section>

            <section className="tos__section">
              <h2>15. Contact</h2>
              <p>
                For questions regarding these Terms of Service, please contact
                us at:
              </p>
              <p className="tos__contact">noreply@senpanime.xyz</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
