import { FormBuilder, FormGroup } from '@angular/forms';

import { PrintResultsService } from './print-results.service';
import { TempDataService } from './../../services/temp-data-service';

import { ProfileData } from './print-results.model';
/**
 *  Common Confirm Item class
 */
export class CommonConfirmItem {
	form: FormGroup;

	protected printResultsService: PrintResultsService;
	protected fb: FormBuilder;
	protected tempDataService: TempDataService;

	constructor(injector) {
		this.printResultsService = injector.get(PrintResultsService);
		this.fb = injector.get(FormBuilder);
		this.tempDataService = injector.get(TempDataService);
	}

	/**
	 * Updates profile data in the {@link PrintResultsService}
	 * @param {Object} updatedObj
	 */
	updateDataInService(updatedObj: Object) {
		this.printResultsService.updateObjData(
			this.printResultsService.profileData,
			updatedObj
		);
	}

	/**
	 * Sets {@link PrintResultsService.isCurrentActiveFormValid}
	 * for disable next btn in confirm components
	 */
	set isCurrentActiveFormValid(isValid: boolean) {
		this.printResultsService.isCurrentActiveFormValid = isValid;
	}

	/**
	 * Gets user data from the {@link PrintResultsService}
	 * @type {*}
	 */
	get userData(): any {
		return this.printResultsService.userData;
    }

    /**
     * Gets profile data from the {@link PrintResultsService}
     * @type {ProfileData}
     */
    get profileData(): ProfileData{
       return this.printResultsService.profileData
    }
}
