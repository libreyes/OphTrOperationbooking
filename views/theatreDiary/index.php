<?php
/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2012
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2012, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

?>
<h2>Theatre Schedules</h2>

<div class="fullWidth fullBox clearfix">
	<div id="whiteBox">
		<p><strong>Use the filters below to view Theatre schedules:</strong></p>
	</div>

	<div id="theatre_display">
		<?php $this->beginWidget('CActiveForm', array('id'=>'theatre-filter', 'action'=>Yii::app()->createUrl('theatre/search'), 'enableAjaxValidation'=>false))?>
		<div id="search-options">
			<div id="main-search" class="grid-view">
				<h3>Search schedules by:</h3>
					<table>
						<tbody>
						<tr>
							<th>Site:</th>
							<th>Theatre:</th>
							<th>Subspecialty:</th>
							<th>Firm:</th>
							<th>Ward:</th>
							<th>Emergency List:</th>
						</tr>
						<tr class="even">
							<td>
								<?php echo CHtml::dropDownList('site-id', @$_POST['site-id'], Site::model()->getListForCurrentInstitution(), array('empty'=>'All sites', 'disabled' => (@$_POST['emergency_list']==1 ? 'disabled' : '')))?>
							</td>
							<td>
								<?php echo CHtml::dropDownList('theatre-id', @$_POST['theatre-id'], $theatres, array('empty'=>'All theatres', 'disabled' => (@$_POST['emergency_list']==1 ? 'disabled' : '')))?>
							</td>
							<td>
								<?php echo CHtml::dropDownList('subspecialty-id', @$_POST['subspecialty-id'], Subspecialty::model()->getList(), array('empty'=>'All specialties', 'disabled' => (@$_POST['emergency_list']==1 ? 'disabled' : '')))?>
							</td>
							<td>
								<?php if (!@$_POST['subspecialty-id']) {?>
									<?php echo CHtml::dropDownList('firm-id', '', array(), array('empty'=>'All firms', 'disabled' => 'disabled'))?>
								<?php } else {?>
									<?php echo CHtml::dropDownList('firm-id', @$_POST['firm-id'], Firm::model()->getList(@$_POST['subspecialty-id']), array('empty'=>'All firms', 'disabled' => (@$_POST['emergency_list']==1 ? 'disabled' : '')))?>
								<?php }?>
							</td>
							<td>
								<?php echo CHtml::dropDownList('ward-id', @$_POST['ward-id'], $wards, array('empty'=>'All wards', 'disabled' => (@$_POST['emergency_list']==1 ? 'disabled' : '')))?>
							</td>
							<td>
								<?php echo CHtml::checkBox('emergency_list', (@$_POST['emergency_list'] == 1))?>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="extra-search" class="eventDetail clearfix">
				<div class="data">
					<span class="group">
						<input type="radio" name="date-filter" id="date-filter_0" value="today"<?php if (@$_POST['date-filter'] == 'today') {?>checked="checked"<?php }?>>
						<label for="date-filter_0">Today</label>
					</span>
					<span class="group">
						<input type="radio" name="date-filter" id="date-filter_1" value="week"<?php if (@$_POST['date-filter'] == 'week') {?>checked="checked"<?php }?>>
						<label for="date-filter_1">Next 7 days</label>
					</span>
					<span class="group">
						<input type="radio" name="date-filter" id="date-filter_2" value="month"<?php if (@$_POST['date-filter'] == 'month') {?>checked="checked"<?php }?>>
						<label for="date-filter_2">Next 30 days</label>
					</span>
					<span class="group">
						<input type="radio" name="date-filter" id="date-filter_3" value="custom"<?php if (@$_POST['date-filter'] == 'custom') {?>checked="checked"<?php }?>>
						<label for="date-filter_3">or select date range:</label>
						<?php $this->widget('zii.widgets.jui.CJuiDatePicker', array(
							'name'=>'date-start',
							'id'=>'date-start',
							// additional javascript options for the date picker plugin
							'options'=>array(
								'showAnim'=>'fold',
								'dateFormat'=>Helper::NHS_DATE_FORMAT_JS
							),
							'value' => @$_POST['date-start'],
							'htmlOptions'=>array('style'=>'width: 110px;')
						))?>
						to
						<?php $this->widget('zii.widgets.jui.CJuiDatePicker', array(
							'name'=>'date-end',
							'id'=>'date-end',
							// additional javascript options for the date picker plugin
							'options'=>array(
								'showAnim'=>'fold',
								'dateFormat'=>Helper::NHS_DATE_FORMAT_JS
							),
							'value' => @$_POST['date-end'],
							'htmlOptions'=>array('style'=>'width: 110px;')
						))?>
					</span>
					<span class="group">
						<a href="" id="last_week">Last week</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="" id="next_week">Next week</a>
					</span>
				</div>
				<div style="float:right;">
					<span style="width: 30px;">
						<img class="loader" src="<?php echo Yii::app()->createUrl('img/ajax-loader.gif')?>" alt="loading..." style="display: none;" />
					</span>
					&nbsp;&nbsp;
					<button id="search_button" type="submit" class="classy green tall"><span class="button-span button-span-green">Search</span></button>
				</div>
			</div>
		</div>
		<?php $this->endWidget()?>
		<div id="theatreList"></div>
		<div class="printable" id="printable"></div>
	</div>
	<div style="text-align:right; margin-right:10px;">
		<button type="submit" class="classy blue tall diaryViewMode" id="btn_print_diary"><span class="button-span button-span-blue">Print</span></button>
		<button type="submit" class="classy blue tall diaryViewMode" id="btn_print_diary_list"><span class="button-span button-span-blue">Print list</span></button>
	</div>
</div>
<div id="iframeprintholder" style="display: none;"></div>
<script type="text/javascript">
	var searchData;

	$(document).ready(function() {
		return getDiary();
	});

	$(this).undelegate('button[id^="btn_save_"]','click').delegate('button[id^="btn_save_"]','click',function() {
		if (!$(this).hasClass('inactive')) {
			disableButtons();
			var selected_tbody_id = $(this).attr('id').match(/[0-9]+/);
			$('#loader2_'+selected_tbody_id).show();

			var data = {}

			var ok = true;

			$('tbody[id="tbody_'+selected_tbody_id+'"] tr td.session input[name^="admitTime_"]').map(function() {
				var m = $(this).attr('id').match(/^admitTime_([0-9]+)_([0-9]+)$/);
				var m2 = $(this).val().match(/^([0-9]{1,2}).*?([0-9]{2})$/);

				if (!m2) {
					alert("Please enter a valid admission time, eg 09:30");
					$(this).select().focus();
					ok = false;
					enableButtons();
					return false;
				} else {
					if (parseInt(m2[1]) <0 || parseInt(m2[1]) > 23 || parseInt(m2[2]) <0 || parseInt(m2[2]) > 59) {
						alert("Please enter a valid admission time, eg 09:30");
						$(this).select().focus();
						ok = false;
						enableButtons();
						return false;
					}
					if (m2[1].length <2) {
						m2[1] = "0"+m2[1];
					}
					$(this).val(m2[1]+":"+m2[2]);
				}
				data["operation_"+m[2]] = m2[1]+":"+m2[2];
			});

			if (!ok) return false;

			data["comments_"+selected_tbody_id] = $('#comments'+selected_tbody_id).val();

			$('tbody[id="tbody_'+selected_tbody_id+'"] tr td.confirm input[name^="confirm_"]').map(function() {
				// Update state so its reflected in view mode on save
				$(this).attr('data-ischecked', $(this).is(':checked'));
				if ($(this).attr('checked')) {
					var id = $(this).attr('id').match(/[0-9]+/);
					data["confirm_"+id] = $(this).val();
				}
			});

			if ($('#consultant_'+selected_tbody_id).is(':checkbox')) {
				data["consultant_"+selected_tbody_id] = $('#consultant_'+selected_tbody_id).is(':checked');
			} else {
				data["consultant_"+selected_tbody_id] = ($('#consultant_'+selected_tbody_id).val() == 1);
			}

			if ($('#paediatric_'+selected_tbody_id).is(':checkbox')) {
				data["paediatric_"+selected_tbody_id] = $('#paediatric_'+selected_tbody_id).is(':checked');
			} else {
				data["paediatric_"+selected_tbody_id] = ($('#paediatric_'+selected_tbody_id).val() == 1);
			}

			if ($('#anaesthetic_'+selected_tbody_id).is(':checkbox')) {
				data["anaesthetic_"+selected_tbody_id] = $('#anaesthetic_'+selected_tbody_id).is(':checked');
			} else {
				data["anaesthetic_"+selected_tbody_id] = ($('#anaesthetic_'+selected_tbody_id).val() == 1);
			}

			if ($('#general_anaesthetic_'+selected_tbody_id).is(':checkbox')) {
				data["general_anaesthetic_"+selected_tbody_id] = $('#general_anaesthetic_'+selected_tbody_id).is(':checked');
			} else {
				data["general_anaesthetic_"+selected_tbody_id] = ($('#general_anaesthetic_'+selected_tbody_id).val() == 1);
			}

			if ($('#available_'+selected_tbody_id).is(':checkbox')) {
				data["available_"+selected_tbody_id] = $('#available_'+selected_tbody_id).is(':checked');
			} else {
				data["available_"+selected_tbody_id] = ($('#available_'+selected_tbody_id).val() == 1);
			}

			$('div.infoBox').hide();

			$('tr[id^="oprow_"]').children('td').attr('style','');

			$.ajax({
				'type': 'POST',
				'data': data,
				'dataType': 'json',
				'url': '<?php echo Yii::app()->createUrl('theatre/saveSessions')?>',
				'success': function(data) {
					var count = 0;

					$.each(data, function(key, value) {
						count += 1;

						$('#oprow_'+value["operation_id"]).children('td:first').attr('style','background: #f44;');
					});

					if (count != 0) {
						alert(count+" admission time"+(count==1 ? '' : 's')+" requested are outside the times of the booked session.\n\nPlease correct the time"+(count==1 ? '' : 's')+" highlighted in red.");

						$('#loader2_'+selected_tbody_id).hide();
						enableButtons();
						return;
					}

					$.ajax({
						'type': 'POST',
						'data': 'session_id='+selected_tbody_id,
						'url': '<?php echo Yii::app()->createUrl('theatre/getSessionTimestamps');?>',
						'success': function(data2) {
							$('#updated-flash').show();

							// Apply changes to the read-only values in the dom
							$('tbody[id="tbody_'+selected_tbody_id+'"] tr td.session input[name^="admitTime_"]').map(function() {
								var m = $(this).attr('id').match(/^admitTime_([0-9]+)_([0-9]+)$/);
								$('#admitTime_ro_'+m[1]+'_'+m[2]).html($(this).val());
							});

							$('#comments_ro_'+selected_tbody_id).html($('#comments'+selected_tbody_id).val());
							$('#comments_ro_'+selected_tbody_id).attr('title',data2);

							// apply chnages to the confirmed checkboxes
							$('#tbody_'+selected_tbody_id+' tr').map(function() {
								var is_confirmed = $(this).children('td.confirm').children('input').is(':checked');

								if (is_confirmed) {
									$(this).children('td.alerts').children('img.confirmed').show();
								} else {
									$(this).children('td.alerts').children('img.confirmed').hide();
								}
							});

							$('#infoBox_'+selected_tbody_id).show();

							view_mode();
							load_table_states();
							<?php if (Yii::app()->user->checkAccess('purplerinse')) {?>
								load_purple_states();
							<?php }?>
							$('div[id^="buttons_"]').hide();
							$('#loader2_'+selected_tbody_id).hide();
							enableButtons();
						}
					});
				}
			});
		}

		return false;
	});

	function getmonth(i) {
		switch (i) {
			case 0: return 'Jan';
			case 1: return 'Feb';
			case 2: return 'Mar';
			case 3: return 'Apr';
			case 4: return 'May';
			case 5: return 'Jun';
			case 6: return 'Jul';
			case 7: return 'Aug';
			case 8: return 'Sep';
			case 9: return 'Oct';
			case 10: return 'Nov';
			case 11: return 'Dec';
		}
	}

	function getmonth_r(m) {
		switch (m) {
			case 'Jan': return 0;
			case 'Feb': return 1;
			case 'Mar': return 2;
			case 'Apr': return 3;
			case 'May': return 4;
			case 'Jun': return 5;
			case 'Jul': return 6;
			case 'Aug': return 7;
			case 'Sep': return 8;
			case 'Oct': return 9;
			case 'Nov': return 10;
			case 'Dec': return 11;
		}
	}

	function format_date(d) {
		// FIXME: This should be getting the format from the Helper somehow 
		return d.getDate() + " " + getmonth(d.getMonth()) + " " + d.getFullYear();
	}

	function clearBoundaries() {
		$('#date-start').datepicker('option','minDate', '');
		$('#date-start').datepicker('option','maxDate', '');
		$('#date-end').datepicker('option','minDate', '');
		$('#date-end').datepicker('option','maxDate', '');
	}

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
		// Calculate week before custom date or week before today if no custom date
		sd = $('#date-start').val();

		clearBoundaries();

		if (sd == '') {
			// No date-start. Make date-start one week before today, date-end today
			today = new Date();
			$('#date-start').datepicker('setDate', format_date(returnDateWithInterval(today, -8)));
			$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(today, -1)));
		} else {
			// Make date-end date-start, make date-start one week before date-start
			$('#date-end').datepicker('setDate', format_date(returnDateWithIntervalFromString(sd, -1)));
			$('#date-start').datepicker('setDate', format_date(returnDateWithIntervalFromString(sd, -7)));
		}

		setDiaryFilter({'date-filter':''});
		$('input[type="radio"]').attr('checked',true);
		$('#date-start').trigger('change');
		$('#date-end').trigger('change');
		return false;
	});

	$('#next_week').click(function() {
		// Calculate week before custom date or week before today if no custom date
		ed = $('#date-end').val();

		clearBoundaries();

		if (ed == '') {
			// No date-start. Make date-start one week before today, date-end today
			today = new Date();

			$('#date-start').datepicker('setDate', format_date(today));
			$('#date-end').datepicker('setDate', format_date(returnDateWithInterval(today, 7)));
		} else {
			// Make date-start date-end, make date-end one week after date-end

			today = new Date();

			if (ed == format_date(today)) {
				$('#date-start').datepicker('setDate', format_date(returnDateWithIntervalFromString(ed, 7)));
				$('#date-end').datepicker('setDate', format_date(returnDateWithIntervalFromString(ed, 13)));
			} else {
				$('#date-start').datepicker('setDate', format_date(returnDateWithIntervalFromString(ed, 1)));
				$('#date-end').datepicker('setDate', format_date(returnDateWithIntervalFromString(ed, 7)));
			}
		}

		setDiaryFilter({'date-filter':''});
		$('input[type="radio"]').attr('checked',true);
		$('#date-start').trigger('change');
		$('#date-end').trigger('change');
		return false;
	});

	function returnDateWithInterval(d, interval) {
		// Uses javascript date format (months from 0 to 11)
		dateWithInterval = new Date(d.getTime() + (86400000 * interval));
		return dateWithInterval;
	}

	function returnDateWithIntervalFromString(ds, interval) {
		// Uses real date format (months from 1 to 12)
		// FIXME: Needs to be defined by Helper
		times = ds.split(' ');

		// Convert to javascript date format
		date = new Date(times[2], getmonth_r(times[1]), times[0], 0, 0, 0, 0);

		dateWithInterval = new Date(date.getTime() + (86400000 * interval));

		return dateWithInterval;
	}

	function dateString(date) {
		m = date.getMonth() + 1;
		if (m < 10) {
			m = '0' + m;
		}

		d = date.getDate();
		if (d < 10) {
			d = '0' + d;
		}

		return date.getFullYear() + '-' + m + '-' + d;
	}

	$('#date-start').bind('change',function() {
		$('#date-end').datepicker('option','minDate',$('#date-start').datepicker('getDate'));
	});

	$('#date-end').bind('change',function() {
		$('#date-start').datepicker('option','maxDate',$('#date-end').datepicker('getDate'));
	});

	function ucfirst(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}

	$('select').change(function() {
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
</script>
