const header = document.querySelector("[data-header]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = contactForm.querySelector("button");
    const formData = new FormData(contactForm);
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Sending...";
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your inquiry...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.className = "form-status is-success";
        formStatus.textContent = "Thanks. Your inquiry has been sent.";
        return;
      }

      let message = "Something went wrong. Please try again, or email Bhoumika Ltd directly.";
      const result = await response.json().catch(() => null);

      if (result?.errors?.length) {
        message = result.errors.map((error) => error.message).join(" ");
      }

      formStatus.className = "form-status is-error";
      formStatus.textContent = message;
    } catch (error) {
      formStatus.className = "form-status is-error";
      formStatus.textContent = "The inquiry could not be sent. Please check your connection and try again.";
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}
