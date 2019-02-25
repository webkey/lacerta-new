/**
 * !Form mask
 * */
var formMaskInit = function(){
	$.each($('.has-phone-mask'), function () {
		$(this).inputmask({
			"mask": "+375 99 999-99-99"
			// , clearMaskOnLostFocus: false
		});
	})
};

/**
 * !Form validation
 * */
var formValidInit = function (){
	// !Код для тестирования успешной отправки формы
	// После успешной отправки формы нужно добавить на тег form класс "form-success"
	// $.validator.setDefaults({
	// 	submitHandler: function(form) {
	// 		$(form).addClass('form-success')
	// 	}
	// });

	$.validator.methods.email = function( value, element ) {
		return this.optional( element ) || /[a-z]+@[a-z]+\.[a-z]+/.test( value );
	};

	var $validationForm = $('.validation-form-js');

	if($validationForm.length) {
		$.each($validationForm, function (i, el) {
			var changeClasses = function (element, removeClass, addClass) {
				var $element = $(element);
				$element
						.removeClass(removeClass)
						.addClass(addClass);
				$element
						.closest('form').find('label[for="' + $element.attr('id') + '"]')
						.removeClass(removeClass)
						.addClass(addClass);
				$element
						.closest('.input-holder')
						.removeClass(removeClass)
						.addClass(addClass);
			};

			$(el).validate({
				errorClass: 'error',
				validClass: 'success',
				errorElement: false,
				// rules: {
				// 	phoneNumber: {
				// 		required: true,
				// 		minlength: 9,
				// 		number: true
				// 	}
				// },
				errorPlacement: function(error,element) {
					return true;
				},
				highlight: function(element, errorClass, successClass) {
					changeClasses(element, successClass, errorClass);
				},
				unhighlight: function(element, errorClass, successClass) {
					changeClasses(element, errorClass, successClass);
				}
			});
		});
	}
};

$(document).ready(function () {
	formMaskInit();
	formValidInit();
});