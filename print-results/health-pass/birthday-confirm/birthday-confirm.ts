import { Component, OnInit, Injector } from '@angular/core';

import { CommonConfirmItem } from './../../common-confirm-item';

import { calculateAge } from '../../../../helper/date';

/**
 * Birthday Confirm component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'birthday-confirm',
	templateUrl: './birthday-confirm.html'
})
export class BirthdayConfirm extends CommonConfirmItem implements OnInit {
	defaultDate: {
		day: number;
		month: number;
		year: number;
	};
	private birthday: Date;

	constructor(injector: Injector) {
		super(injector);
	}

	/**
	 * Inits birthday
	 */
	ngOnInit() {
		const userDate = this.userData;
		if (!userDate || !userDate.birthday) return;
		let birthday = this.userData.birthday;
		if (typeof birthday === 'string') {
			birthday = new Date(Date.parse(birthday));
		}
		this.birthday = birthday;
		this.defaultDate = {
			day: this.birthday.getUTCDate(),
			month: this.birthday.getUTCMonth(),
			year: this.birthday.getUTCFullYear()
		};
	}

	/**
	 * Updates value in the {@link PrintResultsService}
	 * @param {{ birthday: Date; isValid: boolean }} value
	 */
	updateBirthday(value: { birthday: Date; isValid: boolean }) {
		this.birthday = value.birthday;
		this.isCurrentActiveFormValid = value.isValid;
		if (value.isValid) {
			this.userData.birthday = this.birthday;
			this.updateDataInService({ birthday: this.birthday });
		}
		if (calculateAge(this.birthday) > 55) {
			this.printResultsService.finishedFlowOn = 2;
		}
	}
}
