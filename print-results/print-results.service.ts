import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ITranslationService, I18NEXT_SERVICE } from 'angular-i18next';
import { ScanService } from './../overview/scan-flow/scan.service';
import {
	HealthProfileService,
	WeakestLinkService,
	TempDataService
} from './../../services';
import { ConfigService } from './../../services/config.service';
import { LanguageService } from '../../services/language.service';
import { PrintData, PrintoutData } from './print-data';

import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

const eksTarifs = {
	bu: 'BV_15',
	ktg: 'KTAG',
	pflege: 'PTG'
};

import {
	IPrintResults,
	ProfileData,
	HealthQuestionsData
} from './print-results.model';

import { calculateAge } from '../../helper/date';
import { obj } from './../../helper/obj.utils';

/**
 *  Print Results Service
 */
@Injectable()
export class PrintResultsService {
	BASE_URL: string = this.configService.processorHostUrl;

	userData: any;
	answers: any = {};
	currentQuestionIndex: number = 0;
	private nasmInstructions: Object;

	private _score: number;
	private _profileData = new ProfileData();
	private _healthQuestionData = new HealthQuestionsData();
	private _finishedFlowOn: number = 3;
	private _result: string;

	private _isCurrentActiveFormValid: boolean = true;
	constructor(
		@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
		private profileService: HealthProfileService,
		private weakestLinkService: WeakestLinkService,
		private langService: LanguageService,
		private scanService: ScanService,
		private configService: ConfigService,
		private http: HttpClient,
		private tempDataService: TempDataService
	) {
		this.nasmInstructions = this.tempDataService.nasmInstructions;
	}
	
	/**
	 * Updates user score
	 */
	updateScore() {
		let result = this.scanService.getScanResults()
			? this.scanService.getScanResults().score
			: 0;

		this.score = (result && + (result * 100).toFixed()) || 0;
	}
	
	/**
	* Returns final data for print
	* @type {IPrintResults}
	*/
	get printResultsData(): IPrintResults {
		return {
			profile: { ...this.profileData },
			healthQuestions: { ...this.healthQuestion },
			result: this.result,
			finishedFlowOn: this.finishedFlowOn
		};
	}

	/**
	 * Returns Profile Data
	 * @type {ProfileData}
	 */
	get profileData(): ProfileData {
		return this._profileData;
	}

	/**
	 * Returns Helth Questions Data
	 * @type {HealthQuestionsData}
	 */
	get healthQuestion(): HealthQuestionsData {
		return this._healthQuestionData;
	}

	get finishedFlowOn(): number {
		return this._finishedFlowOn;
	}

	set finishedFlowOn(value: number) {
		this._finishedFlowOn = value;
	}

	get result(): string {
		return this._result;
	}

	set result(value: string) {
		this._result = value;
	}

	get score(): number {
		return this._score;
	}

	set score(value: number) {
		this._score = value;
	}

	get isCurrentActiveFormValid(): boolean {
		return this._isCurrentActiveFormValid;
	}

	set isCurrentActiveFormValid(value: boolean) {
		this._isCurrentActiveFormValid = value;
	}

	/**
	 * Helps for update data
	 */
	updateObjData(_obj, data: any) {
		obj.update(_obj, data);
	}

	/**
	 * Fetchs user data from server
	 */
	fetchUserData() {
		this.profileService.retrieveHealthProfile().subscribe(profile => {
			this.userData = profile;
			this.initFlow(profile);
		});
	}

	/**
	 * Saves health data after passed health test
	 */
	saveHealthData(): Observable<any> {
		const data = this.printResultsData;
		
		if (typeof data.profile.occupation === 'object') {
			data.profile.occupation = data.profile.occupation.nameDe;
		}
		const url = `${this.BASE_URL}/health-day/data`;
		return this.http
			.post(url, { data })
			.map(response => response, error => error);
	}

	/**
	 * Inits data for flow after fetch user data
	 * @param {*} profile
	 */
	initFlow(profile) {
		this._profileData = new ProfileData();
		this._healthQuestionData = new HealthQuestionsData();
		this.updateObjData(this._profileData, {
			goal: profile.goal,
			birthday: profile.birthday,
			gender: profile.gender,
			occupation: profile.occupation,
			occupationId: profile.occupation.hdiId
		});

		if (
			profile.occupation.risk !== 'A' &&
			profile.occupation.risk !== 'B' &&
			profile.occupation.risk !== 'C'
		) {
			this.finishedFlowOn = 2;
		}
		if (profile.birthday && calculateAge(new Date(profile.birthday)) > 55)
			this.finishedFlowOn = 2;
	}

	/**
	 * Colects, generates data for print
	 * @param {ProfileData} [profileData]
	 * @returns {PrintData}
	 */
	generatePrintData(profileData?: ProfileData): PrintData {
		const data = {
			birthdate: profileData ? profileData.birthday : this.userData.birthday,
			occupation:
				profileData && profileData.occupation
					? this.langService.getTranslatedName(profileData.occupation)
					: this.langService.getTranslatedName(this.userData.occupation) || '',

			weakestLink: this.weakestLinkService.weakestLinkInfo.name,
			weakestLinkDescription: this.weakestLinkService.weakestLinkInfo.description,
			weakestLinkImg: `${
				profileData ? profileData.gender : this.userData.gender
			}${this.weakestLinkService.weakestLinkInfo.imgLinkPart}.png`,
			score: this.score,
			scanDate: this.scanService.getScanResults().createdAt,
			printDate: new DatePipe('en-US').transform(new Date(), 'dd MMM, yyyy'),
			stabil: this.getExerciseGroup('flexibility'),
			mobil: this.getExerciseGroup('strengthening'),
			finishedFlowOn: this._finishedFlowOn,
			healthInsurance: this.healthInsurance,
			officeWork:
				this.profileData.officeWork && this.profileData.officeWork * 100,
			jobPosition: this.jobPosition,
			healthQuestions: this.healthQuestion,
			insuranceTotalIncom:
				profileData &&
				(67 - calculateAge(new Date(profileData.birthday))) * (12 * 3500)
		};
		return data;
	}

	/**
	 * Gets exercises from {@link WeakestLinkService} and translates them
	 * @param {string} groupKey
	 */
	private getExerciseGroup(groupKey: string) {
		let excerciseGroups = this.weakestLinkService.getAttrFromWeakestLink(
			'excerciseGroups'
		);

		if (excerciseGroups) {
			return excerciseGroups[groupKey].map(nasmInstructionId => {
				return this.i18NextService.t(
					`${this.nasmInstructions[nasmInstructionId].i18n.name}`
				);
			});
		} else {
			return [];
		}
	}

	/**
	 * Returns translated insurance
	 * @type {string}
	 */
	get healthInsurance(): string {
		const healthInsurance = this.profileData.healthInsurance || '';
		let healthInsuranceName: string;
		this.tempDataService.insuranceOptions.forEach(item => {
			if (item.id === healthInsurance) {
				healthInsuranceName = item.i18n.name;
			}
		});

		return this.i18NextService.t(healthInsuranceName);
	}

	/**
	 * Returns translated job Position
	 * @type {string}
	 */
	get jobPosition(): string {
		const jobPosition: string = this.profileData.jobPosition || 'employee';

		let jobPositionName: string;
		this.tempDataService.jobPositionOptions.forEach(item => {
			if (item.id === jobPosition) {
				jobPositionName = item.i18n.name;
			}
		});
		return this.i18NextService.t(jobPositionName);
	}


	/**
	 * Gets data from HDI's services
	 * @returns {Observable<Object[]>}
	 */
	getHDIData(): Observable<Object[]> {
		let httpRegArr: Observable<Object>[] = [];
		for (const tarif in eksTarifs) {
			httpRegArr.push(
				this.http.post(
					this.configService.eksUrl(tarif),
					new PrintoutData(
						eksTarifs[tarif],
						this.profileData.monthlyExpenses,
						this.profileData.gender,
						this.profileData.officeWork,
						this.profileData.physicalWork,
						this.jobPositionForHDI,
						this.profileData.occupationId,
						this.profileData.grossIncome,
						this.profileData.birthday,
						this.profileData.healthInsurance,
						this.profileData.netIncome
					)
				)
			);
		}
		return forkJoin(httpRegArr);
	}

	/**
	 * Returns job position for HDI
	 * @type {string}
	 */
	get jobPositionForHDI(): string {
		let jobPositionForHDI: string;
		this.tempDataService.jobPositionOptions.forEach(item => {
			if (item.id === this.profileData.jobPosition) {
				jobPositionForHDI = item.hdiName;
			}
		});

		return jobPositionForHDI;
	}

	/**
	 * Resets all personal data
	 */
	resetPersonalData() {
		this._profileData = new ProfileData();
		this._healthQuestionData = new HealthQuestionsData();
		this.userData = null;
	}
}
