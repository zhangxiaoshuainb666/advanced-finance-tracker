# CPT304 Coursework 1 Report Draft

## Section 1: App Selection

Our team selected **Advanced Finance Tracker**, a small vanilla HTML/CSS/JavaScript application for recording income, expenses, balances, charts, filters, and CSV export. It was suitable because the business goal is easy to understand, while the original implementation still contained realistic professionalisation issues: accessibility gaps, missing baseline compliance evidence, no test coverage pipeline, no internationalisation, and no privacy notice. This made it a good target for research-led enhancement without changing the app into a different product.

## Section 2: Deficiency 1 - Required Field Instructions

**Detection.** Manual source inspection found that required fields relied mainly on native `required` attributes and placeholders. The page did not consistently explain the required marker visually and programmatically.

**Literature.** W3C WAI recommends that form instructions explain required inputs and expected formats before or near controls, because screen readers may enter forms mode and skip surrounding context [1]. WebAIM also notes that asterisks may be misunderstood or not announced, and recommends `aria-required` or `required` when the required state is not clear from label text [2].

**Implementation.** The fix adds a visible form hint, required markers in labels, and `aria-required` on required controls. The research led directly to keeping instructions visible instead of relying on placeholder-only guidance.

```html
<!-- Before -->
<input id="titleInput" type="text" placeholder="e.g., Freelance Payment" required />

<!-- After -->
<p class="form__hint" id="formHint">* Indicates a required field</p>
<label class="form__field">
  <span>Title<span class="required-indicator" aria-hidden="true">*</span></span>
  <input id="titleInput" required aria-required="true" />
</label>
```

## Section 3: Deficiency 2 - Validation Feedback Not Programmatically Connected

**Detection.** The original error elements were visually placed after inputs, but invalid states were not consistently exposed with `aria-invalid`, `aria-describedby`, or live feedback.

**Literature.** WebAIM's validation guidance recommends inline errors for context, associating each message to its control with `aria-describedby`, focusing the first invalid control, and setting `aria-invalid="true"` on invalid controls [3]. W3C Technique ARIA21 gives the same pattern for programmatic error identification [4].

**Implementation.** Validation was moved into `finance-core.js` so the same rules can be tested. Inputs now start with `aria-invalid="false"`, switch to `"true"` only after failed submission, and point to field-specific error messages.

```html
<!-- Before -->
<small class="error" id="titleError"></small>

<!-- After -->
<input id="titleInput" aria-describedby="titleError" aria-invalid="false" />
<small id="titleError" class="error" role="alert" aria-live="polite"></small>
```

## Section 4: Deficiency 3 - Toast Messages Were Visual Only

**Detection.** The original toast container was a plain `<div>`, so actions such as “Transaction added” could appear visually without being announced to assistive technology.

**Literature.** W3C Technique ARIA22 recommends `role="status"` for status messages because it provides polite live-region behaviour without moving focus [5]. The same technique advises explicitly adding `aria-atomic="true"` for broader support [5].

**Implementation.** The toast container now uses `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`. This keeps the existing non-blocking toast pattern while making state changes programmatically available.

```html
<!-- Before -->
<div class="toast-container" id="toastContainer"></div>

<!-- After -->
<div id="toastContainer" class="toast-container"
     role="status" aria-live="polite" aria-atomic="true"></div>
```

## Section 5: Deficiency 4 - Theme Toggle State Was Ambiguous

**Detection.** The original theme button was visually clickable but did not expose a stable toggle state. A screen reader user could not reliably know whether dark mode was currently active.

**Literature.** Deque's accessible button guidance explains that native `<button>` controls already provide keyboard support, and that toggle buttons should expose `aria-pressed="true/false"` for screen reader users [6]. MDN also describes `aria-pressed` as the state attribute for toggle buttons [7].

**Implementation.** The theme control is now a semantic button with an accessible label and `aria-pressed` synced from application state. The visible label remains stable as “Dark Mode”, while `aria-pressed` communicates whether that mode is active.

```html
<!-- Before -->
<button id="themeToggleBtn" type="button">Light Mode</button>

<!-- After -->
<button id="themeToggleBtn" type="button"
        aria-label="Toggle color theme"
        aria-pressed="true">Dark Mode</button>
```

## Section 6: Baseline Standards Evidence

The refactored app now includes a two-language toggle, a Cookie Banner, a dedicated `privacy.html` page, and a Node test suite with a CI coverage gate. Local coverage evidence from `npm run coverage` is: 100.00% line coverage, 100.00% function coverage, and 88.52% branch coverage for `finance-core.js`. Insert visual evidence before final submission: Figure 1 Vercel 7-day uptime/deployment log; Figure 2 Codecov badge showing 80%+ coverage; Figure 3 Lighthouse Accessibility score 90+; Figure 4 language switch in English/Chinese; Figure 5 Cookie Banner and Privacy Policy page.

## Section 7: Individual Contribution Forms

Attach the completed `individual-contribution.xlsx` file for all four members. Replace placeholder names, IDs, marks, and PR links with real team information before submission.

## Section 8: References

[1] W3C WAI, “Form Instructions,” Web Accessibility Initiative. [Online]. Available: https://www.w3.org/WAI/tutorials/forms/instructions/

[2] WebAIM, “Creating Accessible Forms: Accessible Form Controls.” [Online]. Available: https://webaim.org/techniques/forms/controls

[3] WebAIM, “Usable and Accessible Form Validation and Error Recovery.” [Online]. Available: https://webaim.org/techniques/formvalidation/

[4] W3C WAI, “Technique ARIA21: Using aria-invalid to Indicate An Error Field.” [Online]. Available: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21

[5] W3C WAI, “Technique ARIA22: Using role=status to present status messages.” [Online]. Available: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22

[6] P. J. Adam, “Building Accessible Buttons with ARIA,” Deque Blog, Sep. 28, 2016. [Online]. Available: https://www.deque.com/blog/accessible-aria-buttons/

[7] MDN Web Docs, “ARIA: aria-pressed attribute.” [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed
