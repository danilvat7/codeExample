import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PrintResultsService } from './../print-results.service';
import { ScanService } from './../../overview/scan-flow/scan.service';
import { SkipQuestionPassPage } from './../skip-question-pass/skip-question-pass';

import { QuestionsPage } from './../health-pass/questions/questions';

/**
 * Introductions to Health Pass component
 */
@Component({
	selector: 'page-introduction',
	templateUrl: './introduction.html'
})
export class IntroductionHealthPassPage implements OnInit {
	private questionsPage = QuestionsPage;
	private skipQuestionPassPage = SkipQuestionPassPage;

	constructor(
		private navCtrl: NavController,
		private printResultsService: PrintResultsService,
		private scanService: ScanService
	) {
		this.printResultsService.score =
			(this.scanService.getScanResults() &&
				+(this.scanService.getScanResults().score * 100).toFixed()) ||
			0;
		this.printResultsService.result =
			this.scanService.getScanResults() && this.scanService.getScanResults().id;
	}

	/**
	 * Fetchs user data and saves it tom {@link PrintResultsService.userData}
	 */
	ngOnInit() {
		this.printResultsService.resetPersonalData();
		this.printResultsService.fetchUserData();
		this.printResultsService.isCurrentActiveFormValid = true;
		this.printResultsService.updateScore();
	}

	/**
	 * Navigates to {@link BirthdayConfirm}
	 */
	goToBirthDatePage() {
		this.navCtrl.push(this.questionsPage);
	}

	/**
	 * Navigates to {@link PrintResults}
	 */
	goToskipQuestions() {
		this.printResultsService.finishedFlowOn = 1;
		this.navCtrl.push(this.skipQuestionPassPage);
	}
}
