const $otherJobField = $('#other-title');
const $jobTitleSelect = $('#title');

const $tshirtColorSelect = $('#color');
const $tshirtColorOptions = $('#color option');
const $tshirtDesignSelect = $('#design');
const JSPunsColors = [
	'cornflowerblue',
	'darkslategrey',
	'gold',
];
const iHeartJSColors = [
	'tomato',
	'steelblue',
	'dimgrey'
];

const $activitiesCollection = $('fieldset.activities input[type="checkbox"]');
const checkedActivities = [];
let runningTotal = 0;

const $paymentSelect = $('#payment');
const $creditCardDiv = $('#credit-card');
const $paypalDiv = $('#paypal');
const $bitcoinDiv = $('#bitcoin');

const $submitButton = $('button[type="submit"]');

/*** Start of on page load section ***/
$('#name').focus();

$otherJobField.hide();

$tshirtColorSelect.prepend('<option value="please select tshirt">Please select a T-shirt theme</option>');
$tshirtColorSelect.val('please select tshirt');
$tshirtColorOptions.hide();

$paymentSelect.val('Credit Card');
$('#payment [value="select method"]').remove();
$paypalDiv.hide();
$bitcoinDiv.hide();
/** End of on page load section **/

// Shows the 'Other' input field if the 'other' option is selected
$jobTitleSelect.on('change', () => {
	if ($jobTitleSelect.val() === 'other') {
		$otherJobField.show();
		$otherJobField.focus();
	} else {
		$otherJobField.hide();
	}
});

$tshirtDesignSelect.on('change', () => {
	$tshirtColorOptions.hide();

	// Shows the color options that match the colors in 'colorArray' argument
	function showAvailableColors(colorArray) {
		$.each($tshirtColorOptions, (indexA, valueA) => {
			$.each(colorArray, (indexB, valueB) => {
				if (valueA.getAttribute('value') === valueB) {
					$tshirtColorOptions.eq(indexA).show();
				}
			});
		});
	}

	const pleaseSelectTshirtOption = $('#color [value="please select tshirt"]');
	// Updates available options
	if ($tshirtDesignSelect.val() === 'js puns') {
		showAvailableColors(JSPunsColors);
		$tshirtColorSelect.val(JSPunsColors[0]);
		pleaseSelectTshirtOption.hide();
	}
	if ($tshirtDesignSelect.val() === 'heart js') {
		showAvailableColors(iHeartJSColors);
		$tshirtColorSelect.val(iHeartJSColors[0]);
		pleaseSelectTshirtOption.hide();
	}
	if ($('#design option:selected').text().toLowerCase() === 'select theme') {
		pleaseSelectTshirtOption.show();
		$tshirtColorSelect.val('please select tshirt');
	}
});

$activitiesCollection.on('click', (e) => {
	// Finds and compares two strings
	function daysAreSame($objA, $objB, attribute) {
		const dayRegex = /^[A-Z][a-z]+day/;
		const objA_Day = $objA.attr(attribute).match(dayRegex);
		const objB_Day = $objB.attr(attribute).match(dayRegex);
		if (objA_Day[0] === objB_Day[0]) {
			return true;
		}
		return false;
	}

	// Finds and returns a string with format T00:00:00-
	function findStartTime(string) {
		const startTimeRegex = /T(0[0-9]|1[0-9]|2[0-3]|[0-9]):([0-5][0-9]):([0-5][0-9])-/;
		if (startTimeRegex.test(string)) {
			return string.match(startTimeRegex);
		}
		return null;
	}

	// Finds and returns a string with format -T00:00:00
	function findEndTime(string) {
		const endTimeRegex = /-T(0[0-9]|1[0-9]|2[0-3]|[0-9]):([0-5][0-9]):([0-5][0-9])$/;
		if (endTimeRegex.test(string)) {
			return string.match(endTimeRegex);
		}
		return null;
	}

	function toMilliseconds(hour, minute, second) {
		return hour * (1000 * 60 * 60) + minute * (1000 * 60) + second * (1000);
	}

	// Returns the start and end time in milliseconds
	function findAndConvertTime(obj, attribute) {
		const dayAndTime = obj.attr(attribute);
		const startTime = findStartTime(dayAndTime);
		const endTime = findEndTime(dayAndTime);
		if (startTime === null || endTime === null) {
			return null;
		}
		const startTimeInMs = toMilliseconds(startTime[1], startTime[2], startTime[3]);
		const endTimeInMs = toMilliseconds(endTime[1], endTime[2], endTime[3]);
		return {
			start: startTimeInMs,
			end: endTimeInMs
		};
	}

	/* Tests if a time range overlaps with another time range. Takes into account
	situations where a range's start and end are inside another range (eg. 2-4 and 1-5).
	Start times are allowed to overlap with end times. */
	function timeOverlaps(a_Start, a_End, b_Start, b_End) {
		if (a_Start >= b_Start && a_Start < b_End) {
			return true;
		}
		if (a_End > b_Start && a_End <= b_End) {
			return true;
		}
		if (b_Start >= a_Start && b_Start < a_End) {
			return true;
		}
		if (b_End > a_Start && b_End <= a_End) {
			return true;
		}
		return false;
	}

	const $elementTarget = $(e.target);
	const targetTime = findAndConvertTime($elementTarget, 'data-day-and-time');
	const targetName = $elementTarget.attr('name');
	// Adds to running total, appends it, and adds an object associated with '$elementTarget'
	if ($elementTarget.is(':checked')) {
		const costInInteger = parseInt($elementTarget.attr('data-cost').match(/\d+/));
		runningTotal += costInInteger;
		checkedActivities.push({
			name: targetName,
			disabled: []
		});
		// Appends if it's the first checkbox checked, else updates appended value
		if (checkedActivities.length === 1) {
			$('fieldset.activities').append('<span id="running-total">Total: $' + runningTotal + '</span>');
		} else {
			$('#running-total').html('Total: $' + runningTotal);
		}
	}

	// If we are checking a checkbox, and if this checkbox has a time, compare it with all checkboxes
	if ($elementTarget.is(':checked') && targetTime !== null) {
		for (let i = 0; i < $activitiesCollection.length; i++) {
			const $ithCheckbox = $activitiesCollection.eq(i);
			const ithCheckboxTime = findAndConvertTime($ithCheckbox, 'data-day-and-time');
			/* Skips checked checkboxes and ones that don't have a time. If day and time
			overlaps, disable '$ithCheckbox' and saves a reference of it in the 'disabled'
			property of object associated with '$elementTarget'. */
			if (!($ithCheckbox.is(':checked')) && ithCheckboxTime !== null) {
				console.log(daysAreSame($ithCheckbox, $elementTarget, 'data-day-and-time'));
				if (daysAreSame($ithCheckbox, $elementTarget, 'data-day-and-time')
					&& timeOverlaps(ithCheckboxTime.start, ithCheckboxTime.end, targetTime.start, targetTime.end)) {
					$ithCheckbox.attr('disabled', true);
					const checkedActivity = checkedActivities.find((obj) => {
						return obj.name === targetName;
					});
					checkedActivity.disabled.push($ithCheckbox.attr('name'));
				}
			}
		}
		// If we are unchecking the checkbox. Get the disabled checkboxes associated with '$elementTarget', and enable them.
	} else if (!($elementTarget.is(':checked')) && targetTime !== null) {
		const checkedActivity = checkedActivities.find((obj) => {
			return obj.name === targetName;
		});
		for (const x of checkedActivity.disabled) {
			const $checkbox = $('.activities [name="' + x + '"]');
			$checkbox.attr('disabled', false);
		}
	}

	// Subtracts from running total and removes object associated with '$elementTarget'
	if (!($elementTarget.is(':checked'))) {
		const costInInteger = parseInt($elementTarget.attr('data-cost').match(/\d+/));
		runningTotal -= costInInteger;
		const checkedActivityIndex = checkedActivities.findIndex((obj) => {
			return obj.name === targetName;
		});
		checkedActivities.splice(checkedActivityIndex, 1);
		// Removes running total if no checkboxes checked, else updates appended value
		if (checkedActivities.length === 0) {
			$('#running-total').remove();
		} else {
			$('#running-total').html('Total: $' + runningTotal);
		}
	}
});

$paymentSelect.on('change', () => {
	if ($paymentSelect.val() === 'Credit Card') {
		$creditCardDiv.show();
		$paypalDiv.hide();
		$bitcoinDiv.hide();
	}
	if ($paymentSelect.val() === 'PayPal') {
		$paypalDiv.show();
		$creditCardDiv.hide();
		$bitcoinDiv.hide();
	}
	if ($paymentSelect.val() === 'Bitcoin') {
		$bitcoinDiv.show();
		$creditCardDiv.hide();
		$paypalDiv.hide();
	}
});

$submitButton.on('click', (e) => {
	let isNameValid = false;
	let isEmailValid = false;
	let isAnyActivityChecked = false;
	let isCardNumberValid = false;
	let isZipCodeValid = false;
	let isCvvValid = false;

	const $nameField = $('#name');
	const $emailField = $('#mail');
	const $cardNumberField = $('#cc-num');
	const $zipCodeField = $('#zip');
	const $cvvField = $('#cvv');

	const nameRegex = /^[a-z]+ ?[a-z]*$/i;
	const emailRegex = /^[^@]+@[^@.]+\.[a-z]+\.?[a-z]*$/i;
	const creditCardRegex = /^[0-9]{13,16}$/;
	const zipCodeRegex = /^[0-9]{5}$/;
	const cvvRegex = /^[0-9]{3}$/;

	// Resets error messages because some fields may be valid when user submits again
	$nameField.prop('style', '');
	$('#name-error').remove();
	$emailField.prop('style', '');
	$('#email-error').remove();
	$('#activities-error').remove();
	$cardNumberField.prop('style', '');
	$('#card-number-error').remove();
	$zipCodeField.prop('style', '');
	$('#zip-code-error').remove();
	$cvvField.prop('style', '');
	$('#cvv-error').remove();

	function insertErrorMessage(element, newDivId, message) {
		element.after(`<div id=${newDivId} style="color:red;padding-bottom:15px">${message}</div>`);
	}

	/* The following 'if' conditions tests if user input satisfies certain conditions.
	If a particular input is not valid, an error message is appended if it does not
	exist already. */
	if (nameRegex.test($nameField.val())) {
		isNameValid = true;
	} else {
		$nameField.prop('style', 'border:2px solid red');
		if ($('#name-error').length < 1) {
			insertErrorMessage($nameField, 'name-error', 'Invalid Name');
		}
	}
	if (emailRegex.test($emailField.val())) {
		isEmailValid = true;
	} else {
		$emailField.prop('style', 'border:2px solid red');
		if ($('#email-error').length < 1) {
			insertErrorMessage($emailField, 'email-error', 'Invalid Email');
		}
	}
	if (checkedActivities.length > 0) {
		isAnyActivityChecked = true;
	} else {
		if ($('#activities-error').length < 1) {
			const $lastLabel = $activitiesCollection.eq($activitiesCollection.length - 1).parent();
			insertErrorMessage($lastLabel, 'activities-error', 'Must select at least one activity');
		}
	}
	if ($paymentSelect.val() === 'Credit Card') {
		if (creditCardRegex.test($cardNumberField.val())) {
			isCardNumberValid = true;
		} else {
			$cardNumberField.prop('style', 'border:2px solid red');
			if ($('#card-number-error').length < 1) {
				insertErrorMessage($cardNumberField, 'card-number-error', 'Invalid Card Number');
			}
		}
		if (zipCodeRegex.test($zipCodeField.val())) {
			isZipCodeValid = true;
		} else {
			$zipCodeField.prop('style', 'border:2px solid red');
			if ($('#zip-code-error').length < 1) {
				insertErrorMessage($zipCodeField, 'zip-code-error', 'Invalid Zip Code');
			}
		}
		if (cvvRegex.test($cvvField.val())) {
			isCvvValid = true;
		} else {
			$cvvField.prop('style', 'border:2px solid red');
			if ($('#cvv-error').length < 1) {
				insertErrorMessage($cvvField, 'cvv-error', 'Invalid CVV');
			}
		}
	}
	// If any field is invalid, don't submit
	if (isNameValid === false || isEmailValid === false || isAnyActivityChecked === false) {
		e.preventDefault();
	}
	if ($paymentSelect.val() === 'Credit Card' && (isCardNumberValid === false ||
		isZipCodeValid === false || isCvvValid === false)) {
		e.preventDefault();
	}
});