import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss']
})
export class DialogComponent {

  trackForm: any;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private messageService: MessageService) { }

  ngOnInit() {
    this.trackForm = new FormGroup({
      trackNumber: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    })
  }

  onSubmit () {
    if (this.trackForm.valid) {
      this.ref.close(this.trackForm.value);
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Не все поля заполнены",
        detail: "Заполните все поля!"
      });
    }
  }

  selectProduct() {
    this.ref.close('CLOSE');
  }
}
