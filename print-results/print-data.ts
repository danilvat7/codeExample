 /** Description of Print Data interface */
export interface PrintData {
	birthdate: any;
	occupation: string;
	printDate?: string;
	weakestLink: string;
	weakestLinkDescription: string;
	weakestLinkImg: string;
	score: number;
	scanDate: number | string;
	stabil: any[];
	mobil: any[];
	finishedFlowOn: number;
	healthInsurance?: string;
	officeWork?: number;
	jobPosition?: string;
	healthQuestions?: any;
	insuranceTotalIncom?: number;
}

 /** Description of Print Data class */
export class PrintoutData {
	tarif: string;
	beginn = 'TAG_043';
	berechnungsvorgabe = 'LEISTUNG';
	druckauswahl = 'ANTRAG';

	gefahrengruppe = 'GEFAHRENGRUPPE_A';
	leistungPlus = true;
	progression = 'PROGRESSION_SPITZEN';
	risikoPlus = true;
	rundumSorglos = true;

	vermittler = { nationalitaet: 'D' };
	versichertePerson = {
		adresse: { land: 'D' },
		ausgabenMtl: '2165', //monthlyExpenses
		bankverbindung: {
			bic: '0000000000',
			iban: 'DE00000000000000000000',
			kontoinhaber: { vorname: 'jhon', name: 'doe', geschlecht: 'WEIBLICH' }, //geschlecht = gender --> female = WEIBLICH, male = MAENLICH
			geschlecht: 'WEIBLICH', //geschlecht = gender --> female = WEIBLICH, male = MAENLICH
			name: 'jhon',
			vorname: 'doe',
			vnKontoinhaber: true
		},
		beruf: {
			anteilBuero: 0,
			anteilKoerper: 0, //physicalWork
			berufstellung: 'Arbeitnehmer', //jobPosition --> employee = Arbeitnehmer,
			//	bezeichnung: 'Testfahrer/in', //we need to check where they get the job description from
			key: '714911', //we need to check where they get the job key from
			zusatzfragen: false //this is true if you choose "Student"
		},
		bruttoEinkommenMtl: '2000', //grossIncome
		geburtsdatum: '1995-03-03T22:00:00.000Z', //birthdate
		gefahrengruppe: 'GEFAHRENGRUPPE_A',
		geschlecht: 'WEIBLICH', //geschlecht = gender --> female = WEIBLICH, male = MAENLICH
		krankenversicherungsart: 'GESETZLICH', //healthInsurance --> satutory = GESETZLICH, voluntarily = FREIWILLIG, private = PRIVAT
		name: 'jhon',
		nationalitaet: 'D',
		nettoEinkommenMtl: '1700', //netIncome
		vorname: 'doe',
		versicherungsbeginn: '2018-11-30T22:00:00.000Z' //30.11. of the current year 23:00:00
	};
	versicherungsbeginn = '2018-11-30T22:00:00.000Z';
	steigerungRente = 'KEINE';
	dynamikPraemie = 'PROZENT_5';
	gewinnform = 'PRAEMIENREDUZIERUNG';

	constructor(
		tarif,
		monthlyExpenses,
		gender,
		officeWork,
		physicalWork,
		jobPosition,
		occupationId,
		grossIncome,
		birthdate,
		healthInsurance,
		netIncome
	) {
		this.tarif = tarif;
		this.versichertePerson.ausgabenMtl = monthlyExpenses;
		const convertedGender = gender === 'Male' ? 'MAENNLICH' : 'WEIBLICH';
		this.versichertePerson.bankverbindung.geschlecht = convertedGender;
		this.versichertePerson.bankverbindung.kontoinhaber.geschlecht = convertedGender;
		this.versichertePerson.geschlecht = convertedGender;
		this.versichertePerson.beruf.anteilBuero = officeWork * 100;
		this.versichertePerson.beruf.anteilKoerper = physicalWork * 100;
		this.versichertePerson.beruf.berufstellung = jobPosition;
		this.versichertePerson.beruf.key = occupationId;
		this.versichertePerson.beruf.zusatzfragen = jobPosition === 'Student';
		this.versichertePerson.bruttoEinkommenMtl = grossIncome;
		this.versichertePerson.geburtsdatum = `${new Date(
			birthdate
		).getFullYear()}-${new Date(birthdate).getMonth() + 1}-${new Date(
			birthdate
		).getDate()}`;
		this.versichertePerson.krankenversicherungsart =
			healthInsurance === 'satutory'
				? 'GESETZLICH'
				: healthInsurance === 'voluntarily'
				? 'FREIWILLIG'
				: 'PRIVAT';
		this.versichertePerson.nettoEinkommenMtl = netIncome;
		const versicherungsbeginn = `${new Date().getFullYear()}-11-30`;
		this.versichertePerson.versicherungsbeginn = versicherungsbeginn;
		this.versicherungsbeginn = versicherungsbeginn;
	}
}
