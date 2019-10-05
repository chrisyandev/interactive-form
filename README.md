# interactive-form

This project is for Treehouse's Full-Stack Techdegree program.

This program uses jQuery extensively to add customized behavior and interactivity. It uses regular expressions to validate
user input, and provides helpful error messages for invalid inputs. A personal goal was to make it as robust as possible,
so that the program will still work when more data is entered.

### Project Goals

To meet the following expectations:

* jQuery
  * Project includes jQuery and utilizes it in at least some aspect of the form.

* Focus on the first field
  * On page load, the cursor appears in the "Name" field, ready for a user to type.

* Job Role Section
  * "Your job role" text field appears when user selects "Other" from the Job Role menu.

* T-Shirt Section
  * Until a theme is selected from the “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.
  * When a new theme is selected from the "Design" menu, the "Color" field and drop down menu is updated.

* Activity Registration
  * User cannot select two activities that are at the same time.
  * Total cost of selected activities is calculated and displayed below the list of activities.

* Displaying payment sections
  * The "Credit Card" payment option is selected by default.
  * Payment option in the select menu matches the payment option displayed on the page.
  * When a user chooses a payment option, the chosen payment section is revealed and the other payment sections are hidden.

* Form Validation
  * Form cannot be submitted (the page does not refresh when the submit button is clicked) until the following requirements have been met:
    * Name field isn’t blank.
    * Email field contains validly formatted e-mail address: (doesn’t have to check that it's a real e-mail address, just that it's formatted like one).
    * At least one checkbox under "Register for Activities" section must be selected.
    * If "Credit Card" is the selected payment option, the three fields accept only numbers: a 13 to 16-digit credit card number, a 5-digit zip code, and 3-number CVV value.

* Form Validation Messages
  * On submission, the form provides an error indication or message for each field that requires validation:
    * Name field
    * Email field
    * “Register for Activities” checkboxes
    * Credit Card number, Zip code, and CVV, only if the credit card payment method is selected.

* Form works without JavaScript
  * When JavaScript is disabled, all form fields and payment information is displayed, including the "Other" field under the "Job Role" section.