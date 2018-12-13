import {
	Component,
	EventEmitter,
	Output,
	Input,
	ComponentFactoryResolver,
	ViewChild,
	ViewContainerRef,
	ComponentRef,
	OnDestroy,
	AfterViewInit
} from '@angular/core';

import { PrintResultsService } from './../../pages/print-results/print-results.service';

import { Question } from './question.model';

import { OverviewPage } from './../../pages/overview/overview';
import { ResumeQuestions } from './../../pages/print-results/health-pass/resume-questions/resume-questions';

const scoreVerge: number = 80;

/**
 * Questions component
 */
@Component({
	selector: 'aimo-questions',
	templateUrl: './aimo-questions.html'
})
export class AimoQuestions implements OnDestroy, AfterViewInit {
	@Input()
	data: Question[] = [];
	@Input()
	set score(value: number) {
		if (value >= this.scoreVerge) {
			this._score = value;
			this._isSkipFisrtQuestion = true;
		}
	}
	@Output()
	onAnswer = new EventEmitter<{
		[key: number]: boolean;
	}>();

	@ViewChild('componentContainer', { read: ViewContainerRef })
	componentContainer;

	scoreVerge: number = scoreVerge;
	private overviewPage = OverviewPage;
	private resumeQuestions = ResumeQuestions;
	private componentRef: ComponentRef<any>;
	private _isSkipFisrtQuestion: boolean = false;
	private _score: number;

	constructor(
		private printResultsService: PrintResultsService,
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngAfterViewInit() {
		this.next();
	}

	ngOnDestroy() {
		this.componentRef && this.componentRef.destroy();
	}

	get index(): number {
		return this.printResultsService.currentQuestionIndex;
	}

	set index(value: number) {
		this.printResultsService.currentQuestionIndex = value;
	}

	/**
	 * Returns current question
	 * @type {Question[]}
	 */
	get currentQuestion(): Question[] {
		return [this.data[this.index]];
	}

	/**
	 * Returns score
	 * @type {number}
	 */
	get score(): number {
		return this._score;
	}

	/**
	 * Returns is skip first question
	 * @type {boolean}
	 */
	get isSkipFisrtQuestion(): boolean {
		return (
			this._isSkipFisrtQuestion &&
			this.currentQuestion[0] &&
			this.currentQuestion[0].mightBeSkip
		);
	}

	/**
	 * Returns is show component
	 * @type {boolean}
	 */
	get isShowComponent(): boolean {
		return this.currentQuestion[0] && !!this.currentQuestion[0].component;
	}

	get btnType(): string {
		return this.currentQuestion[0] && this.currentQuestion[0].btnType;
	}

	/**
	 * Changes index question,
	 * emits event of question change
	 * @param {boolean} resultisSkipFisrtQuestion
	 */
	next(result?: boolean) {
		if (this.currentQuestion[0] && this.currentQuestion[0].questionId) {
			this.printResultsService.updateObjData(
				this.printResultsService.healthQuestion,
				{ [this.currentQuestion[0].questionId]: result }
			);
		}
		this.onAnswer.emit({ [this.index]: result });
		if (this.index < this.data.length - 1) {
			this.index++;
			this.createComponent();
		}
	}

	/**
	 * Changes index question,
	 * @returns {boolean}
	 */
	prev(): boolean {
		if (this.index === 0) {
			return true;
		} else {
			this.index--;
			this.createComponent();
			return false;
		}
	}

	/**
	 * Scips first question
	 * @memberof AimoQuestions
	 */
	skipFirst() {
		this.index++;
		// this.isSkipFisrtQuestion = false;
	}

	/**
	 * Returns is animate
	 * @type {boolean}
	 */
	get isAnimate(): boolean {
		return !(
			this.data[this.index - 1] &&
			this.data[this.index - 1].question === this.data[this.index].question
		);
	}

	/**
	 * Returns is current activated form valid
	 * @type {boolean}
	 */
	get isCurrentActiveFormValid(): boolean {
			return this.printResultsService.isCurrentActiveFormValid;
		}

	/**
	 * Render dynamic components 
	 */
	private createComponent() {
		let component = this.currentQuestion[0].component;
		if (this.isShowComponent) {
			this.componentContainer && this.componentContainer.clear();
			const factory = this.componentFactoryResolver.resolveComponentFactory(component);
			this.componentRef = this.componentContainer.createComponent(factory);
		} else {
			this.componentContainer && this.componentContainer.clear();
		}
	}

}
