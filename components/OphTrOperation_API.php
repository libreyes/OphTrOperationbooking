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

class OphTrOperation_API {
	public function getBookingsForEpisode($episode_id) {
		$criteria = new CDbCriteria;
		$criteria->order = 'datetime asc';
		$criteria->addCondition('episode_id',$episode_id);

		return OphTrOperation_Operation_Booking::model()
			->with('session')
			->with(array(
				'operation' => array(
					'condition' => "episode_id = $episode_id",
					'with' => 'event'
				)
			))
			->findAll($criteria);
	}

	public function getOperationProcedures($operation_id) {
		return OphTrOperation_Operation_Procedures::model()->findAll('element_id=?',array($operation_id));
	}

	public function getOperationForEvent($event_id) {
		return Element_OphTrOperation_Operation::model()->find('event_id=?',array($event_id));
	}
}
