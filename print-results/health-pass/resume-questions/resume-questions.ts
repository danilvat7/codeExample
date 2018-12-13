import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { ITranslationService, I18NEXT_SERVICE } from 'angular-i18next';

import { PrintResultsService } from './../../print-results.service';
import { PrintService } from './../../../../services/print.service';
import { ToastService } from './../../../../services/toast.service';

import { OverviewPage } from './../../../overview/overview';
import { AimoPrint } from './../../../../components/aimo-print/aimo-print';

import { obj } from '../../../../helper/obj.utils';

/**
 * Resume Questions component
 */
@Component({
	selector: 'page-resume-questions',
	templateUrl: './resume-questions.html'
})
export class ResumeQuestions implements OnInit {
	@ViewChild('printTemplate') printTemplate: AimoPrint;

	private overviewPage = OverviewPage;
	private secondFlowNum: number = 2;
	dataToPrint: any = {};
	constructor(
		@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
		private printResultsService: PrintResultsService,
		private printService: PrintService,
		private toastService: ToastService
	) {}

	ngOnInit() {
		this.printResultsService.finishedFlowOn = obj
			.values(this.printResultsService.healthQuestion)
			.some(Boolean)
			? 2
			: 3;
		this.dataToPrint = this.printResultsService.generatePrintData(
			this.printResultsService.profileData
		);
	}
	/**
	 * Prints results
	 */
	printResults() {
		this.printService.printResults('Results', this.printTemplate.template());
		this.saveHealthData();
	}
	
	/**
	 * Saves health data on the serve
	 */
	private saveHealthData() {
		this.printResultsService.saveHealthData().subscribe(
			_ => {},
			err => {
				this.toastService.presentToast(
					`${this.i18NextService.t('i18nextInitFailed')}: ${err}`,
					true,
					3000,
					null,
					false
				);
			}
		);
	}

	/**
	 * Returns is all answers true
	 * @type {boolean}
	 */
	get isAllAnswerTrue(): boolean {
		const answers: any[] = obj.values(this.printResultsService.answers);
		return answers.every(answer => answer);
	}

	get isShowSecondScreen(): boolean {
		return this.printResultsService.finishedFlowOn === this.secondFlowNum;
	}
}
