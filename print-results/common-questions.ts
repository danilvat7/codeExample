import { ViewChild } from '@angular/core';
import { Content, Navbar, NavController } from 'ionic-angular';

import { PrintResultsService } from './print-results.service';

import { AimoQuestions } from './../../components/aimo-questions/aimo-questions';
import { Question } from './../../components/aimo-questions/question.model';

/**
 * Common Questions class
 */
export class CommonQuestions {
	@ViewChild('questions')
	questions: AimoQuestions;
	@ViewChild(Content)
	content: Content;
	@ViewChild(Navbar)
	navbar: Navbar;

	questionList: Question[];

	protected printResultsService: PrintResultsService;
	protected navCtrl: NavController;
	constructor(injector) {
		this.printResultsService = injector.get(PrintResultsService);
		this.navCtrl = injector.get(NavController);
		this.printResultsService.currentQuestionIndex = -1;
	}

	/**
	 * Returns current question
	 * @type {number}
	 */
	get currentQuestionNumber(): number {
		return this.questionList.indexOf(this.questions.currentQuestion[0]) + 1;
	}

	/**
	 * Returns question img url
	 * @type {string}
	 */
	get questionImgUrl(): string {
		return this.questions.currentQuestion[0]
			? this.questions.currentQuestion[0].imageUrl
			: '';
	}

	/**
	 * Returns question icon class name
	 * @type {string}
	 */
	get questionIconClassName(): string {
		return this.questions.currentQuestion[0]
			? this.questions.currentQuestion[0].iconClassName
			: '';
	}
}
