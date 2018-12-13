import { Component, ViewChild, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { I18NextPipe } from 'angular-i18next';

import { CommonConfirmItem } from './../../common-confirm-item';

import { SelectListItem } from './../../../../components/aimo-select-list/select-list.model';
import { AimoDropdown } from './../../../../components/aimo-dropdown/aimo-dropdown';
import { OccupationService } from './../../../myprofile/ocuppation/occupation.service';

/**
 * Occupation Confirm component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'occupation-confirm',
	templateUrl: './occupation-confirm.html'
})
export class OccupationConfirm extends CommonConfirmItem implements OnInit {
	@ViewChild('occupationDropdown') occupationDropdown: AimoDropdown;
	jobPositionOptions: SelectListItem[];
	occupation: string;
	student: boolean = false;
	official: boolean = false;
	rest: boolean;
	occupationPrint: FormGroup;

	constructor(
		injector: Injector,
		public occupationService: OccupationService,
		private i18NextPipe: I18NextPipe
	) {
		super(injector);
	}

	/**
	 * Inits form,
	 * Updates value in the {@link PrintResultsService}
	 */
	ngOnInit() {
		this.jobPositionOptions = this.tempDataService.jobPositionOptions;

		this.form = this.fb.group({
			jobPosition: [
				this.profileData.jobPosition || 'employee',
				Validators.required
			],
			medicalStudent: [
				this.profileData.medicalStudent || false,
				Validators.required
			],
			official: [this.profileData.official || false, Validators.required],
			occupationPrint: this.fb.group({
				occupation: [this.userData.occupation.nameDe, Validators.required]
			})
		});

		this.isCurrentActiveFormValid = this.form.valid;

		if (this.userData) {
			this.occupation = this.userData.occupation;
		}

		this.form.valueChanges.subscribe(value => {
			this.isCurrentActiveFormValid = this.form.valid;

			this.updateDataInService({
				jobPosition: value.jobPosition,
				medicalStudent: value.medicalStudent,
				official: value.official
			});
		});
	}

	/**
	 * Returns translated label
	 */
	get checkBoxLabelStudent(): string {
		return this.i18NextPipe.transform('medicalStudent.label');
	}

	/**
	 * Returns translated label
	 */
	get checkBoxLabelOfficial(): string {
		return this.i18NextPipe.transform('official.label');
	}

	/**
	 * Updates value in the {@link PrintResultsService}
	 * @param {*} occupation
	 */
	onSelectOccupation(occupation) {
		this.updateDataInService({
			occupation: occupation,
			occupationId: occupation.hdiId
		});
		if (
			occupation.risk !== 'A' &&
			occupation.risk !== 'B' &&
			occupation.risk !== 'C'
		) {
			this.printResultsService.finishedFlowOn = 2;
		}
	}

	/**
	 * Updates value in the {@link PrintResultsService}
	 * @param {string} jobPosition
	 */
	onSelectJobPosition(jobPosition: string) {
		this.updateDataInService({ jobPosition });
	}

	/**
	 * Returns medical student value
	 * @type {boolean}
	 */
	get medicalStudentValue(): boolean {
		return this.form.get('medicalStudent').value;
	}

	/**
	 * Returns official value
	 * @type {boolean}
	 */
	get officialValue(): boolean {
		return this.form.get('official').value;
	}

	/**
	 * Chages checkbox
	 * @param {boolean} val
	 * @param {string} checkBoxName
	 */
	changeCheckbox(val: boolean, checkBoxName: string) {
		this.form.patchValue({
			[checkBoxName]: val
		});
	}
}
