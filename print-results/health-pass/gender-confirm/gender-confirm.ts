import {
	Component,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	OnInit,
	Injector
} from '@angular/core';

import { CommonConfirmItem } from './../../common-confirm-item';
/**
 * Gender Confirm component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'gender-confirm',
	templateUrl: 'gender-confirm.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenderConfirm extends CommonConfirmItem implements OnInit {
	genderId: string;

	constructor(injector: Injector, private cd: ChangeDetectorRef) {
		super(injector);
	}

	/**
	 * Sets value
	 */
	ngOnInit() {
		if (this.userData) {
			this.genderId = this.userData.gender;
			this.isCurrentActiveFormValid = true;
			this.cd.markForCheck();
		}
	}

	/**
	 * Updates value in the {@link PrintResultsService}
	 * @param {*} gender
	 */
	changeGender(gender: any) {
		this.userData.gender = gender.id;
		this.updateDataInService({ gender: gender.id });
		this.cd.markForCheck();
	}
}
