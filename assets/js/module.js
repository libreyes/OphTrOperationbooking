/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

(function() {
	function updateRTTInfo(el) {
		var show = false;
		var cs, b;

		var selectedVal = $(el).val();
		$(el).find('option').each(function() {
			if ($(this).attr('value') == selectedVal) {
				cs = $(this).data('clock-start');
				b = $(this).data('breach');
				return false;
			}
		});

		if (cs) {
			$('#rtt-clock-start').html(cs);
			show = true;
		}
		else {
			$('#rtt-clock-start').html('');
		}
		if (b) {
			$('#rtt-breach').html(b);
			show = true;
		}
		else {
			$('#rtt-breach').html('');
		}
		if (show) {
			$('#rtt-info').show();
		}
		else {
			$('#rtt-info').hide();
		}
	}

	function ProcedureChecker(options) {
		this.options = $.extend(true, {}, ProcedureChecker._defaultOptions, options);
	}

	ProcedureChecker._defaultOptions = {
		'procCheckURI': '/OphTrOperationbooking/default/verifyProcedures'
	}

	ProcedureChecker.prototype.verifySubmit = function(form) {
		disableButtons();
		$.ajax({
			url: this.options.procCheckURI + '?patient_id=' + OE_patientId,
			data: $(form).serialize(),
			type: 'POST',
			dataType: 'JSON',
			success: function(response) {
				if (response.previousProcedures) {
					var dialog = new OpenEyes.UI.Dialog.Confirm({
						content: response.message,
						title: 'Duplicate procedure(s)'
					});
					dialog.on('ok', function() {
						$(form).trigger('submit');
					}.bind(this));

					dialog.on('cancel', function() {enableButtons(); });
					dialog.open();
				}
				else {
					$(form).trigger('submit');
				}
			}.bind(this),
			error: function(jqXHR, status, error) {
				var alert = new OpenEyes.UI.Dialog.Alert({
					content: 'An unexpected error has occurred, cannot save at this time.'
				});
				alert.on('close', function() { enableButtons(); });
				alert.open();

			}.bind(this)
		});

	}

	$(document).ready(function() {
		updateRTTInfo($('#Element_OphTrOperationbooking_Operation_referral_id'));
		$('#Element_OphTrOperationbooking_Operation_referral_id').on('change', function() {
			updateRTTInfo($(this));
		});

		var procChecker = new ProcedureChecker();

		$(this).on('click', '#et_save, #et_save_and_schedule', function(e) {
			if (OE_confirmProcedures) {
				e.preventDefault();
				procChecker.verifySubmit(e.target.form);
			}
		});


	});
}());
