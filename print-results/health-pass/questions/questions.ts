import { Component, OnInit, Injector, Inject } from '@angular/core';
import { ITranslationService, I18NEXT_SERVICE } from 'angular-i18next';

import { ResumeQuestions } from '../resume-questions/resume-questions';
import { OccupationConfirm } from './../occupation-confirm/occupation-confirm';
import { BirthdayConfirm } from './../birthday-confirm/birthday-confirm';
import { GoalConfirm } from './../goal-confirm/goal-confirm';
import { GenderConfirm } from '../gender-confirm/gender-confirm';
import { InsuredStatus } from './../insured-status/insured-status';
import { WorkTimeConfirm } from '../work-time-confirm/work-time-confirm';
import { IncomeExpenses } from './../income-expenses/income-expenses';

import { CommonQuestions } from './../../common-questions';

/**
 * Questions Page component
 * @extends {CommonQuestions}
 */
@Component({
	selector: 'page-questions',
	templateUrl: './questions.html'
})
export class QuestionsPage extends CommonQuestions implements OnInit {
	score: number;
	private resumeQuestions = ResumeQuestions;

	constructor(
		injector: Injector,
		@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService
	) {
		super(injector);

		/**
		 * Questions list
		 */
		this.questionList = [
			{
				question: 'printResults.goalQuestion.title',
				subquestion: 'goal',
				component: GoalConfirm,
				imageUrl: 'assets/print-flow-icons/Motivation_Deliverable.gif',
				btnType: 'confirm',
				iconClassName: 'goal'
			},
			{
				question: 'printResults.birthdayQuestion.title',
				subquestion: 'birthday',
				component: BirthdayConfirm,
				imageUrl: 'assets/print-flow-icons/Age_Deliverable.gif',
				btnType: 'confirm',
				iconClassName: 'birthday'
			},
			{
				question: 'printResults.genderQuestion.title',
				subquestion: 'gender',
				component: GenderConfirm,
				imageUrl: 'assets/print-flow-icons/Gender_Deliverable.gif',
				btnType: 'confirm'
			},
			{
				question: 'printResults.occupationQuestion.title',
				subquestion: 'occupation',
				component: OccupationConfirm,
				imageUrl: 'assets/print-flow-icons/Occupation_Deliverable.gif',
				btnType: 'confirm'
			},
			{
				question: 'printResults.workTimeQuestion.title',
				subquestion: 'work-time',
				component: WorkTimeConfirm,
				imageUrl: 'assets/print-flow-icons/OfficeWork_Deliverable.gif',
				btnType: 'confirm'
			},
			{
				question: 'printResults.incomeExpensesQuestion.title',
				subquestion: 'income-expenses',
				component: IncomeExpenses,
				imageUrl: 'assets/print-flow-icons/Finance_Deliverable.gif',
				btnType: 'confirm',
				iconClassName: 'income-expenses'
			},
			{
				question: 'Wie bist du momentan krankenversichert?',
				subquestion: 'insured-status',
				component: InsuredStatus,
				imageUrl: 'assets/print-flow-icons/Insurance_Deliverable.gif',
				btnType: 'confirm'
			},
			{
				questionId: 'musculoskeletal',
				question: 'printResults.musculoskeletalQuestion.title',
				subquestion: 'printResults.musculoskeletalQuestion.subquestion',
				imageUrl: 'assets/print-flow-icons/Movement_Deliverable.gif',
				mightBeSkip: true
			},
			{
				questionId: 'cardiology',
				question: 'printResults.cardiologyQuestion.title',
				subquestion: 'printResults.cardiologyQuestion.subquestion',
				imageUrl: 'assets/print-flow-icons/Heart_Deliverable.gif'
			},
			{
				questionId: 'psychology',
				question: 'printResults.psychologyQuestion.title',
				subquestion: 'printResults.psychologyQuestion.subquestion',
				imageUrl: 'assets/print-flow-icons/Mental_Deliverable.gif'
			},
			{
				questionId: 'heavyDiseases',
				question: 'printResults.heavyDiseasesQuestion.title',
				subquestion: 'printResults.heavyDiseasesQuestion.subquestion',
				imageUrl: 'assets/print-flow-icons/HealthCheck_Deliverable.gif'
			},
			{
				questionId: 'disability',
				question: 'printResults.disabilityQuestion.title',
				subquestion: 'printResults.disabilityQuestion.subquestion',
				imageUrl: 'assets/print-flow-icons/Injury_Deliverable.gif'
			}
		];
	}

	/**
	 * Gets scan score
	 */
	ngOnInit() {
		this.score = this.printResultsService.score;

		if (this.score >= 80) {
			this.questionList.forEach(item => {
				if (item.mightBeSkip) {
					item.question = `${this.i18NextService.t(
						'printResults.skipWhenHighScore.title'
					)}: ${this.score}%`;
					item.subquestion = this.i18NextService.t(
						'printResults.skipWhenHighScore.subtitle'
					);
				}
			});
		}
		this.navbar.backButtonClick = () => this.goBack();
		this.navbar.setElementClass('questions-back-btn', true);
	}

	/**
	 * Navigates to previous page
	 */
	goBack() {
		if (this.questions.prev()) {
			this.navCtrl.pop({ animate: false });
		}
	}

	/**
	 * Answer handler,
	 * navigates to {@link ResumeQuestions},
	 * @param {*} answer
	 */
	onAnswer(answer: any) {
		const key = +Object.keys(answer)[0];
		this.printResultsService.answers[key + 1] = answer[key];
		if (key === this.questionList.length - 1) {
			this.navCtrl.push(this.resumeQuestions);
		}
	}
}
