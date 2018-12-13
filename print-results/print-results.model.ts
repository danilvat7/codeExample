import { Occupation } from '../../pages/myprofile/ocuppation/occupation.model';

/** Description of Profile Data class */
export class ProfileData {
	goal: string = null;
	birthday: string = null;
	gender: string = null;
	occupation: Occupation | string = null;
	occupationId: string = null;
	jobPosition: string = null;
	medicalStudent: boolean = null;
	official: boolean = null;
	officeWork: number = null;
	physicalWork: number = null;
	employeeResponsibility: number = null;
	grossIncome: number = null;
	netIncome: number = null;
	monthlyExpenses: number = null;
	healthInsurance: string = null;
	monthlyHealthInsuranceCost: number = null;
}

/** Description of Health Questions Data class */
export class HealthQuestionsData {
	musculoskeletal: boolean = null;
	cardiology: boolean = null;
	psychology: boolean = null;
	heavyDiseases: boolean = null;
	disability: boolean = null;
}

/** Description of Print Results interface */
export interface IPrintResults {
	profile: ProfileData;
	healthQuestions: HealthQuestionsData;
	result?: {
		//score, weakest link etc. or simply the ID to the result
	};
	finishedFlowOn?: {};
}
