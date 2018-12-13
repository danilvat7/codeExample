import { CommonQuestions } from './../common-questions';
import { Component, Injector } from '@angular/core';

import { GoalConfirm } from './../health-pass/goal-confirm/goal-confirm';
import { PrintResults } from './print-results/print-results';
/**
 *  Skip Question Pass Page component
 * @extends {CommonQuestions}
 */
@Component({
	selector: 'page-skip-question-pass',
	templateUrl: './skip-question-pass.html'
})
export class SkipQuestionPassPage extends CommonQuestions {
	constructor(injector: Injector) {
		super(injector);

		/**
		 * Questions list
		 */
		this.questionList = [
			{
				question: 'Worin siehst du zurzeit deine höchste Priorität?',
				subquestion: 'goal',
				component: GoalConfirm,
				imageUrl: 'assets/print-flow-icons/Motivation_Deliverable.gif',
				btnType: 'confirm'
			},
			{
				question:
					'Erhalte jetzt deine Resultate und Empfehlungen basierend auf deinem AIMO Scan.',
				subquestion: 'print-result',
				component: PrintResults,
				imageUrl: 'assets/print-flow-icons/Movement_Deliverable.gif'
			}
		];
	}
}
