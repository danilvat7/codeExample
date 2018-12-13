/** Description of Question interface */
export interface Question {
	questionId?: string;
	question: string;
	subquestion: string;
	imageUrl: string;
	component?: any;
	mightBeSkip?: true;
	btnType?: string;
	iconClassName?: string;
}
