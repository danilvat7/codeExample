import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { ITranslationService, I18NEXT_SERVICE } from 'angular-i18next';

import { PrintResultsService } from './../../print-results.service';
import { PrintService } from './../../../../services/print.service';
import { ToastService } from './../../../../services/toast.service';

import { AimoPrint } from './../../../../components/aimo-print/aimo-print';
import { PrintData } from '../../print-data';

/**
 * Print results component
 */
@Component({
	selector: 'page-print-results',
	templateUrl: './print-results.html'
})
export class PrintResults {
	@ViewChild('printTemplate') printTemplate: AimoPrint;
	dataToPrint: PrintData;

	constructor(
		private printService: PrintService,
		@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
		private printResultsService: PrintResultsService,
		private toastService: ToastService
	) {
		this.dataToPrint = this.printResultsService.generatePrintData();
	}

	/**
	 * Prints results
	 */
	printResults() {
		this.saveHealthData();
		this.printService.printResults('Results', this.printTemplate.template());
	}
	
	/**
	 * Saves health data on the serve
	 */
	saveHealthData() {
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
}
