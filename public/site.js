document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const forms = document.querySelectorAll('[data-signup-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameField = form.querySelector('input[name="name"]');
      const emailField = form.querySelector('input[name="email"]');
      const hpField = form.querySelector('input[name="_hp"]');
      const nameError = form.querySelector('[data-error-for="name"]');
      const emailError = form.querySelector('[data-error-for="email"]');
      const responseMessage = form.querySelector('.response-message');
      const submitBtn = form.querySelector('.submit-btn');

      if (!nameField || !emailField || !submitBtn) {
        return;
      }

      nameField.classList.remove('error');
      emailField.classList.remove('error');
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (responseMessage) responseMessage.textContent = '';

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      let isValid = true;

      if (!name) {
        nameField.classList.add('error');
        if (nameError) nameError.textContent = 'Name is required';
        isValid = false;
      }

      if (!email) {
        emailField.classList.add('error');
        if (emailError) emailError.textContent = 'Email is required';
        isValid = false;
      } else if (!isValidEmail(email)) {
        emailField.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      if (hpField && hpField.value !== '') {
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(form);
      const body = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        body.append(key, String(value));
      }

      fetch('/__forms/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Form submission failed');
          }
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          form.reset();
          if (responseMessage) {
            responseMessage.textContent = "Thanks — we received your signup. We’ll be in touch.";
          }
        })
        .catch(function () {
          if (responseMessage) {
            responseMessage.textContent = 'Sorry, there was an error. Please try again.';
          }
        })
        .finally(function () {
          submitBtn.setAttribute('aria-busy', 'false');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || 'Sign up';
        });
    });
  });
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
