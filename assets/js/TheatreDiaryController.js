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

$(document).ready(function() {
	$('#theatre-filter button[type="submit"]').click(function() {
		return getDiary();
	});

	$('#theatre-filter input[name=emergency_list]').change(function() {
		$('#site-id').attr("disabled", $(this).is(':checked'));
		$('#subspecialty-id').attr("disabled", $(this).is(':checked'));
		$('#theatre-id').attr("disabled", $(this).is(':checked'));
		$('#firm-id').attr("disabled", $(this).is(':checked'));
		$('#ward-id').attr("disabled", $(this).is(':checked'));
	});

	$('#date-filter_0').click(function() {
		today = new Date();

		clearBoundaries();

		$('#date-start').datepicker('setDate', format_date(today));
		$('#date-end').datepicker('setDate', format_date(today));

		setDiaryFilter({'date-filter':'today','date-start':$('#date-start').val(),'date-end':$('#date-end').val()});

		return true;
	});

	$('#date-filter_1').click(function() {
		today = new Date();

		clearBoundaries();

		$('#date-start').datepicker('setDate', format_date(today));
		$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(today, 6)));

		setDiaryFilter({'date-filter':'week','date-start':$('#date-start').val(),'date-end':$('#date-end').val()});

		return true;
	});

	$('#date-filter_2').click(function() {
		today = new Date();

		clearBoundaries();

		$('#date-start').val(format_date(today));
		$('#date-end').val(format_date(returnDateWithInterval(today, 29)));

		setDiaryFilter({'date-filter':'month','date-start':$('#date-start').val(),'date-end':$('#date-end').val()});

		return true;
	});

	$('#date-filter_3').click(function() {

		setDiaryFilter({'date-filter':'custom','date-start':$('#date-start').val(),'date-end':$('#date-end').val()});

		return true;
	});

	$('#last_week').click(function() {
		sd = $('#date-start').val();

		clearBoundaries();

		if (sd == '') {
			today = new Date();
			$('#date-start').datepicker('setDate', format_date(returnDateWithInterval(today, -8)));
			$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(today, -1)));
		} else {
			$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(new Date(sd), -1)));
			$('#date-start').datepicker('setDate', format_date(returnDateWithInterval(new Date(sd), -7)));
		}

		setDiaryFilter({'date-filter':''});
		$('input[type="radio"]').attr('checked',true);
		$('#date-start').trigger('change');
		$('#date-end').trigger('change');
		return false;
	});

	$('#next_week').click(function() {
		ed = $('#date-end').val();

		clearBoundaries();

		if (ed == '') {
			today = new Date();

			$('#date-start').datepicker('setDate', format_date(today));
			$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(today, 7)));
		} else {
			today = new Date();

			if (ed == format_date(today)) {
				$('#date-start').datepicker('setDate', format_date(returnDateWithInterval(new Date(ed), 7)));
				$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(new Date(ed), 13)));
			} else {
				$('#date-start').datepicker('setDate', format_date(returnDateWithInterval(new Date(ed), 1)));
				$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(new Date(ed), 7)));
			}
		}

		setDiaryFilter({'date-filter':''});
		$('input[type="radio"]').attr('checked',true);
		$('#date-start').trigger('change');
		$('#date-end').trigger('change');

		return false;
	});

	$('#date-start').bind('change',function() {
		$('#date-end').datepicker('option','minDate',$('#date-start').datepicker('getDate'));
	});

	$('#date-end').bind('change',function() {
		$('#date-start').datepicker('option','maxDate',$('#date-end').datepicker('getDate'));
	});

	$('#theatre-filter select').change(function() {
		var hash = {};
		hash[$(this).attr('id')] = $(this).val();
		setDiaryFilter(hash);
	});

	$('#emergency_list').click(function() {
		if ($(this).is(':checked')) {
			setDiaryFilter({'emergency_list':1});
		} else {
			setDiaryFilter({'emergency_list':0});
		}
	});

	$('#date-start').change(function() {
		setDiaryFilter({'date-start':$(this).val()});
		$('#date-filter_3').attr('checked','checked');
	});

	$('#date-end').change(function() {
		setDiaryFilter({'date-end':$(this).val()});
		$('#date-filter_3').attr('checked','checked');
	});

	$("#btn_print_diary").click(function() {
		disableButtons();
		printElem('printDiary', {
			pageTitle:'openeyes printout',
			printBodyOptions:{styleToAdd:'width:auto !important; margin: 0.75em !important;',classNameToAdd:'openeyesPrintout'},
			//overrideElementCSS:['css/module.css',{href:'css/module.css',media:'print'}]
		}, enableButtons);
	});

	$('#btn_print_diary_list').click(function() {
        if(!$('#theatre-filter #emergency_list').prop('checked') && ($('#site-id').val() == '' || $('#subspecialty-id').val() == '' ) ){
            new OpenEyes.UI.Dialog.Alert({
                content: 'A site and subspecilaty must be selected when printing a non emergency list.',
                onClose: function() {
                    scrollTo(0,0);
                }
            }).open();
            return false;
        }

        if ( $('#date-start').val() == '' || $('#date-end').val() == '') {
			new OpenEyes.UI.Dialog.Alert({
				content: 'To print the booking list you must select a date range.',
				onClose: function() {
					scrollTo(0,0);
				}
			}).open();
			return false;
		}
		disableButtons();
		printElem('printList',{
			pageTitle:'openeyes printout',
			printBodyOptions:{
				styleToAdd:'width:auto !important; margin: 0.75em !important;',
				classNameToAdd:'openeyesPrintout'
			},
			//overrideElementCSS:['css/module.css',{href:'css/module.css',media:'print'}]
		}, enableButtons);
	});

	$(this).undelegate('a.edit-session','click').delegate('a.edit-session','click',function() {
		cancel_edit();

		disableButtons($('button,.button').not('.theatre'));
		$('.loader').hide();

		theatre_edit_session_id = $(this).attr('rel');

		theatre_edit_session_data = {};

		if ($('div.purpleUser').length >0) {
			theatre_edit_session_data["purple_rinse"] = {
				"consultant": $('#consultant_'+theatre_edit_session_id).is(':checked'),
				"paediatric": $('#paediatric_'+theatre_edit_session_id).is(':checked'),
				"anaesthetist": $('#anaesthetist_'+theatre_edit_session_id).is(':checked'),
				"general_anaesthetic": $('#general_anaesthetic_'+theatre_edit_session_id).is(':checked'),
				"available": $('#available_'+theatre_edit_session_id).is(':checked')
			};
		}

		theatre_edit_session_data["row_order"] = [];
		theatre_edit_session_data["confirm"] = {};
		theatre_edit_session_data["comments"] = $('.panel.comments p.comments[data-id="'+theatre_edit_session_id+'"]').text();

		$('#tbody_'+theatre_edit_session_id).children('tr').map(function(){
			theatre_edit_session_data["row_order"].push($(this).attr('id'));
			var id = $(this).attr('id').match(/[0-9]+/);
			theatre_edit_session_data["confirm"][id] = $('#confirm_'+id).is(':checked');
		});

		$('#tbody_'+theatre_edit_session_id+' .diaryViewMode').hide();
		$('div.session_options.diaryViewMode').hide();
		$('.panel.comments .comments.diaryViewMode').hide();
		$('button.diaryViewMode').hide();
		$('.diaryEditMode[data-id="'+theatre_edit_session_id+'"]').show();
		$('.action_options[data-id="'+theatre_edit_session_id+'"]').show();

		$("#tbody_"+theatre_edit_session_id).sortable({
			 helper: function(e, tr) {
				 var $originals = tr.children();
				 var $helper = tr.clone();
				 $helper.children().each(function(index) {
					 $(this).width($originals.eq(index).outerWidth())
				 });
				 return $helper;
			 },
			 placeholder: 'theatre-list-sort-placeholder'
		}).disableSelection();
		$("#theatre_list tbody").sortable('enable');

		$('tbody[id="tbody_'+theatre_edit_session_id+'"] td.confirm input[name^="confirm_"]').attr('disabled',false);
		$('th.footer').attr('colspan','10');

		return false;
	});

	$(this).undelegate('a.view-session','click').delegate('a.view-session','click',function() {
		cancel_edit();
		return false;
	});

	$('input[id^="consultant_"]').die('click').live('click',function() {
		if (!$(this).is(':checked')) {
			var session_id = $(this).attr('id').match(/[0-9]+/);
			checkRequired('consultant',session_id);
		}
	});

	$('input[id^="paediatric_"]').die('click').live('click',function() {
		if (!$(this).is(':checked')) {
			var session_id = $(this).attr('id').match(/[0-9]+/);
			checkRequired('paediatric',session_id);
		}
	});

	$('input[id^="anaesthetist_"]').die('click').live('click',function() {
		if (!$(this).is(':checked')) {
			var session_id = $(this).attr('id').match(/[0-9]+/);
			checkRequired('anaesthetist',session_id);
		}
	});

	$('input[id^="general_anaesthetic_"]').die('click').live('click',function() {
		if (!$(this).is(':checked')) {
			var session_id = $(this).attr('id').match(/[0-9]+/);
			checkRequired('general_anaesthetic',session_id);
		}
	});

	$(this).undelegate('button[id^="btn_edit_session_save_"]','click').delegate('button[id^="btn_edit_session_save_"]','click',function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();

			var session_id = $(this).attr('id').match(/[0-9]+/);

			$('input[name^="admitTime_"]').map(function() {
				var m = $(this).val().match(/^([0-9]{1,2}).*?([0-9]{2})$/);
				if (m) {
					if (m[1].length == 1) {
						m[1] = '0'+m[1];
					}
					$(this).val(m[1]+':'+m[2]);
				}
			});

			$.ajax({
				type: "POST",
				data: $('#session_form'+session_id).serialize()+"&session_id="+session_id+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN,
				dataType: 'json',
				url: baseUrl+'/OphTrOperationbooking/theatreDiary/saveSession',
				success: function(errors) {
					var first = false;
					$('#tbody_'+session_id).children('tr').attr('style','');

					for (var operation_id in errors) {
						$('#oprow_'+operation_id).attr('style','background-color: #f00;');

						if (!first) {
							$('input[name="admitTime_'+operation_id+'"]').select().focus();
							first = true;
						}
					}

					if (first) {
						new OpenEyes.UI.Dialog.Alert({
							content: "One or more admission times were entered incorrectly, please correct the entries highlighted in red."
						}).open();
						enableButtons();
						return false;
					}

					$('tr[id^="oprow_"]').attr('style','');

					$('#session_form'+session_id+' span.admitTime_ro').map(function() {
						$(this).text($('input[name="admitTime_'+$(this).attr('data-operation-id')+'"]').val());
					});

					$('.panel.comments .comments[data-id="'+session_id+'"]').text($('textarea[name="comments_'+session_id+'"]').val());

					function checkedOrOne(field) {
						if($(field).prop('type') == 'checkbox') {
							return $(field).is(':checked');
						} else if($(field).prop('type') == 'hidden') {
							return ($(field).val() == 1);
						}
					}

					checkedOrOne($('#available_'+session_id)) ? $('#session_unavailable_'+session_id).hide() : $('#session_unavailable_'+session_id).show();
					checkedOrOne($('#consultant_'+session_id)) ? $('#consultant_icon_'+session_id).show() : $('#consultant_icon_'+session_id).hide();
					checkedOrOne($('#anaesthetist_'+session_id)) ? $('#anaesthetist_icon_'+session_id).show() : $('#anaesthetist_icon_'+session_id).hide();
					$('#anaesthetist_icon_'+session_id).html(checkedOrOne($('#general_anaesthetic_'+session_id)) ? 'Anaesthetist (GA)' : 'Anaesthetist');
					checkedOrOne($('#paediatric_'+session_id)) ? $('#paediatric_icon_'+session_id).show() : $('#paediatric_icon_'+session_id).hide();

					cancel_edit(true);
					$('#infoBox_'+session_id).show();

					enableButtons();
				}
			});
		}

		return false;
	});

	$(this).undelegate('button[id^="btn_edit_session_cancel_"]','click').delegate('button[id^="btn_edit_session_cancel_"]','click',function() {
		cancel_edit();
		return false;
	});

	new OpenEyes.UI.StickyElement('.panel.actions', {
		offset: -44,
		enableHandler: function() {
			this.element.width(this.element.width());
			this.enable();
		},
		disableHandler: function() {
			this.element.width('auto');
			this.disable();
		}
	});
});

function getDiary() {

	var button = $('#theatre-filter button[type="submit"]');
	var loadingMessage = $('#theatre-search-loading');
	var noResultsMessage = $('#theatre-search-no-results');
	var theatreList = $('#theatreList');

	if (!button.hasClass('inactive')) {
		disableButtons();

		theatreList.empty();
		loadingMessage.show();
		noResultsMessage.hide();

		searchData = $('#theatre-filter').serialize()+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN;

		$.ajax({
			'url': baseUrl+'/OphTrOperationbooking/theatreDiary/search',
			'type': 'POST',
			'dataType': 'json',
			'data': searchData,
			'success': function(data) {
				if (data['status'] == 'success') {
					theatreList.html(data['data']);
				} else {
					theatreList.html('<h3>'+data['message']+'</h3>');
				}
				enableButtons();
				return false;
			},
			complete: function() {
				loadingMessage.hide();
			}
		});
	}

	return false;
}

function setDiaryFilter(values) {
	var data = '';
	var load_theatres_and_wards = false;

	for (var i in values) {
		if (data.length >0) {
			data += "&";
		}
		data += i + "=" + values[i];

		var field = i;
		var value = values[i];
	}

	$.ajax({
		'url': baseUrl+'/OphTrOperationbooking/theatreDiary/setDiaryFilter',
		'type': 'POST',
		'data': data+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN,
		'success': function(html) {
			if (field == 'site-id') {
				loadTheatresAndWards(value);
			} else if (field == 'subspecialty-id') {
				$.ajax({
					'url': baseUrl+'/OphTrOperationbooking/theatreDiary/filterFirms',
					'type': 'POST',
					'data': 'subspecialty_id='+$('#subspecialty-id').val()+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN,
					'success': function(data) {
						if ($('#subspecialty-id').val() != '') {
							$('#firm-id').attr('disabled', false);
							$('#firm-id').html(data);
						} else {
							$('#firm-id').attr('disabled', true);
							$('#firm-id').html(data);
						}
					}
				});
			}
		}
	});
}

function loadTheatresAndWards(siteId) {
	$.ajax({
		'type': 'POST',
		'data': {'site_id': siteId, 'YII_CSRF_TOKEN': YII_CSRF_TOKEN},
		'url': baseUrl+'/OphTrOperationbooking/theatreDiary/filterTheatres',
		'success':function(data) {
			$('#theatre-id').html(data);
			$.ajax({
				'type': 'POST',
				'data': {'site_id': siteId, 'YII_CSRF_TOKEN': YII_CSRF_TOKEN},
				'url': baseUrl+'/OphTrOperationbooking/theatreDiary/filterWards',
				'success':function(data) {
					$('#ward-id').html(data);
				}
			});
		}
	});
}

function clearBoundaries() {
	$('#date-start').datepicker('option','minDate', '').datepicker('option','maxDate', '');
	$('#date-end').datepicker('option','minDate', '').datepicker('option','maxDate', '');
}

function returnDateWithInterval(d, interval) {
	return new Date(d.getTime() + (86400000 * interval));
}

function theatreDiaryIconHovers() {
	var offsetY = 28;
	var offsetX = 10;
	var tipWidth = 0;

	$('.alerts img').hover(function(e){

		var img = $(this);
		var titleText = $(this).attr('title');
		var tooltip = $('<div class="tooltip alerts"></div>').appendTo('body');

		img.data({
			'tipText': titleText,
			'tooltip': tooltip
		});
		img.removeAttr('title');

		tooltip.text(' ' + titleText);

		$('<img />').attr({
				width:'17',
				height:'17',
				src:img.attr('src')
		}).prependTo(tooltip);

		tipWidth = tooltip.outerWidth();
		tooltip.css('top', (e.pageY - offsetY) + 'px').css('left', (e.pageX - (tipWidth + offsetX)) + 'px').fadeIn('fast');

	},function(e){
		$(this).attr('title',$(this).data('tipText'));
		$(this).data('tooltip').remove();
	}).mousemove(function(e) {
		$(this).data('tooltip')
			.css('top', (e.pageY - offsetY) + 'px')
			.css('left', (e.pageX - (tipWidth + offsetX)) + 'px');
	});
}

function printElem(method,options, callback){
	$.ajax({
		'url': baseUrl+'/OphTrOperationbooking/theatreDiary/'+method,
		'type': 'POST',
		'data': searchData,
		'success': function(data) {
			$('#printable').html(data);
			$('#printable').printElement(options);
			if ($.isFunction(callback)) {
				callback();
			}
			return false;
		},
        'error':function(){
            new OpenEyes.UI.Dialog.Alert({
                content: 'There was an error when Printing List, please try again or contact support.',
                onClose: function() {
                    scrollTo(0,0);
                }
            }).open();
            enableButtons();
        }
	});
}

function cancel_edit(dont_reset_checkboxes) {
	enableButtons();
	if (!dont_reset_checkboxes && theatre_edit_session_id != null) {
		for (var i in theatre_edit_session_data.purple_rinse) {
			$('#'+i+'_'+theatre_edit_session_id).attr('checked',(theatre_edit_session_data.purple_rinse[i] ? 'checked' : false));
		}
	}

	if (theatre_edit_session_data) {
		if (!dont_reset_checkboxes) {
			var rows = '';

			for (var i in theatre_edit_session_data["row_order"]) {
				rows += '<tr id="'+theatre_edit_session_data["row_order"][i]+'">'+$('#'+theatre_edit_session_data["row_order"][i]).html()+'</tr>';
			}

			$('#tbody_'+theatre_edit_session_id).html(rows);

			for (var i in theatre_edit_session_data["row_order"]) {
				var id = theatre_edit_session_data["row_order"][i].match(/[0-9]+/);

				$('#confirm_'+id).attr('checked',(theatre_edit_session_data["confirm"][id] ? 'checked' : false));
			}

			$('textarea[name="comments_'+theatre_edit_session_id+'"]').val(theatre_edit_session_data['comments']);

		} else {
			for (var i in theatre_edit_session_data["row_order"]) {
				var id = theatre_edit_session_data["row_order"][i].match(/[0-9]+/);
				theatre_edit_session_data["confirm"][id] = $('#confirm_'+id).is(':checked');
			}
		}
	}

	$('.diaryViewMode').show();
	$('.diaryEditMode').hide();
	$('.infoBox').hide();
	$('tbody[id="tbody_'+theatre_edit_session_id+'"] td.confirm input[name^="confirm_"]').attr('disabled','disabled');
	$('th.footer').attr('colspan','9');

	theatre_edit_session_id = null;
}

var theatre_edit_session_id = null;
var theatre_edit_session_data = null;

function checkRequired(type, session_id) {
	$.ajax({
		type: "POST",
		data: 'type='+type+'&session_id='+session_id+"&YII_CSRF_TOKEN="+YII_CSRF_TOKEN,
		url: baseUrl+'/OphTrOperationbooking/theatreDiary/checkRequired',
		success: function(html) {
			if (html == "1") {
				$('#'+type+'_'+session_id).attr('checked',true);
				switch (type) {
					case 'consultant':
						new OpenEyes.UI.Dialog.Alert({
							content: "Sorry, you cannot remove the 'Consultant required' flag from this session because there are one or more patients booked into it who require a consultant."
						}).open();
						break;
					case 'paediatric':
						new OpenEyes.UI.Dialog.Alert({
							content: "Sorry, you cannot remove the 'Paediatric' flag from this session because there are one or more patients booked into it who are paediatric."
						}).open();
						break;
					case 'anaesthetist':
						new OpenEyes.UI.Dialog.Alert({
							content: "Sorry, you cannot remove the 'Anaesthetist required' flag from this session because there are one or more patients booked into it who require an anaesthetist."
						}).open();
						break;
					case 'general_anaesthetic':
						new OpenEyes.UI.Dialog.Alert({
							content: "Sorry, you cannot remove the 'General anaesthetic available' flag from this session because there are one or more patients booked into it who require a general anaesthetic."
						}).open();
						break;
				}

				return false;
			}
		}
	});
}
