import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonConfirmItem } from './../../common-confirm-item';

/**
 * Income Expenses component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'income-expenses',
	templateUrl: './income-expenses.html'
})
export class IncomeExpenses extends CommonConfirmItem implements OnInit {
	constructor(injector: Injector) {
		super(injector);
	}

	/**
	 * Inits form,
	 * Updates value in the {@link PrintResultsService}
	 */
	ngOnInit() {
		this.form = this.fb.group({
			grossIncome: ['', [Validators.required, Validators.min(1)]],
			netIncome: ['', [Validators.required, Validators.min(1)]],
			monthlyExpenses: [0]
		});

		['grossIncome', 'netIncome', 'monthlyExpenses'].forEach(category => {
			this.addControl(category);
		});

		this.form.patchValue({
			grossIncome: this.profileData.grossIncome || '',
			netIncome: this.profileData.netIncome || '',
			monthlyExpenses: this.profileData.monthlyExpenses || 0
		});

		this.isCurrentActiveFormValid = this.form.valid;

		this.form.valueChanges.subscribe(value => {
			this.isCurrentActiveFormValid = this.form.valid;

			this.updateDataInService({
				grossIncome: value.grossIncome,
				netIncome: value.netIncome,
				monthlyExpenses: value.monthlyExpenses
			});
		});
	}

	/**
	 * Adds control to form
	 */
	private addControl(category) {
		this.form.addControl(
			category,
			this.fb.control('', [Validators.required, Validators.min(1)])
		);
	}
	
	/**
	 * Returns current slider value
	 * @param {*} sliderValue
	 * @returns {number}
	 */
	getCurrentValue(sliderValue): number {
		return this.profileData[sliderValue] || 0;
	}
}
