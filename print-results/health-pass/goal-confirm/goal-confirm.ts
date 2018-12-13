import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { CommonConfirmItem } from './../../common-confirm-item';
import { SelectListItem } from './../../../../components/aimo-select-list/select-list.model';

/**
 * Goal Confirm component
 * @extends {CommonConfirmItem}
 */
@Component({
	selector: 'goal-confirm',
	templateUrl: './goal-confirm.html'
})
export class GoalConfirm extends CommonConfirmItem implements OnInit {
	goalOptions: SelectListItem[];
	constructor(injector: Injector) {
		super(injector);
	}

	/**
	 * Inits form
	 */
	ngOnInit() {
		this.goalOptions = this.tempDataService.goalOptions;
		this.form = this.fb.group({
			goal: [this.printResultsService.profileData.goal, Validators.required]
		});
	}

	/**
	 * Updates value in the {@link PrintResultsService}
	 * @param {string} goal
	 */
	onSelectGoal(goal: string) {
		this.updateDataInService({ goal });
	}
}
