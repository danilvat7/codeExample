import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { SelectListItem } from './../../../../components/aimo-select-list/select-list.model';
import { CommonConfirmItem } from './../../common-confirm-item';
/**
 * Insured Status component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'insured-status',
	templateUrl: './insured-status.html'
})
export class InsuredStatus extends CommonConfirmItem implements OnInit {
	insuranceOptions: SelectListItem[];
	minimumMonthlyHealthInsuranceCost = 1;

	constructor(injector: Injector) {
		super(injector);
	}

	/**
	 * Inits form,
	 * Updates value in the {@link PrintResultsService}
	 */
	ngOnInit() {
		this.insuranceOptions = this.tempDataService.insuranceOptions;
		this.form = this.fb.group({
			healthInsurance: ['', Validators.required]
		});

		if (
			this.profileData.healthInsurance === 'private' ||
			this.profileData.healthInsurance === 'voluntarily'
		) {
			this.addControl();
		}

		this.form.patchValue({
			healthInsurance: this.profileData.healthInsurance || '',
			monthlyHealthInsuranceCost:
				this.profileData.monthlyHealthInsuranceCost || ''
		});

		this.isCurrentActiveFormValid = this.form.valid;

		this.form.get('healthInsurance').valueChanges.subscribe(value => {
			if (value === 'private' || value === 'voluntarily') {
				this.addControl();
			} else {
				this.form.removeControl('monthlyHealthInsuranceCost');
			}
		});

		this.form.valueChanges.subscribe(value => {
			this.isCurrentActiveFormValid = this.form.valid;
			this.updateDataInService({
				healthInsurance: value.healthInsurance,
				monthlyHealthInsuranceCost: value.monthlyHealthInsuranceCost
			});
		});
	}

	/**
	 * Adds control to form
	 */
	private addControl() {
		this.form.addControl(
			'monthlyHealthInsuranceCost',
			this.fb.control('', [
				Validators.required,
				Validators.min(this.minimumMonthlyHealthInsuranceCost)
			])
		);
	}

	/**
	 * Returns monthly value
	 * @type {number}
	 */
	get monthlyHealthInsuranceCostValue(): number {
		return this.profileData.monthlyHealthInsuranceCost || 0;
	}
}
