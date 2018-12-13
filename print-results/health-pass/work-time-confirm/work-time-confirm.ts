import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { CommonConfirmItem } from './../../common-confirm-item';
import { SelectListItem } from './../../../../components/aimo-select-list/select-list.model';

/**
 * Work Time Confirm component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'work-time-confirm',
	templateUrl: 'work-time-confirm.html'
})
export class WorkTimeConfirm extends CommonConfirmItem implements OnInit {
	personalResponsibilityOptions: SelectListItem[];

	constructor(Injector: Injector) {
		super(Injector);
	}

	/**
	 * Inits form,
	 * Updates value in the {@link PrintResultsService}
	 */
	ngOnInit() {
		this.personalResponsibilityOptions = this.tempDataService.personalResponsibilityOptions;

		this.form = this.fb.group({
			officeWork: [0, [Validators.required, Validators.min(0)]],
			physicalWork: [0, [Validators.required, Validators.min(0)]],
			personalResponsibility: [
				this.profileData.employeeResponsibility || '0',
				Validators.required
			]
		});

		this.updateDataInService({
			officeWork: 1,
			physicalWork: 0
		});

		this.form.patchValue({
			officeWork: this.profileData.officeWork
				? this.profileData.officeWork * 100
				: 100,
			physicalWork: this.profileData.physicalWork
				? this.profileData.physicalWork * 100
				: 0,
			personalResponsibility: this.profileData.employeeResponsibility || '0'
		});

		this.isCurrentActiveFormValid = this.form.valid;

		this.form.valueChanges.subscribe(value => {
			this.isCurrentActiveFormValid = this.form.valid;

			this.updateDataInService({
				officeWork: value.officeWork / 100,
				physicalWork: value.physicalWork / 100,
				employeeResponsibility: +value.personalResponsibility
			});
		});
	}

	/**
	 * Returns office work
	 * @type {number}
	 */
	get officeWorkValue(): number {
		return this.profileData.officeWork
			? this.profileData.officeWork * 100
			: 100;
	}

	/**
	 * Returns physical work
	 * @type {number}
	 */
	get physicalWorkValue(): number {
		return this.profileData.physicalWork
			? this.profileData.physicalWork * 100
			: 0;
	}
}
