import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-avaliacao-fisica',
  templateUrl: './avaliacao-fisica.component.html',
  styleUrls: ['./avaliacao-fisica.component.css'],
  styles: [
		`
			.light-blue-backdrop {
				background-color: #5cb3fd;
			}
		`,
	]
})

export class AvaliacaoFisicaComponent {
  closeResult?: string;

  constructor(private modalService: NgbModal) {}

  openModalInsert(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true, scrollable: true });

	}

  openModalUpdate(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true, scrollable: true });
	}

}
