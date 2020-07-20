import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {DataService} from '../../core/services/data.service';
import {IModalContent, ModalService} from '../../core/modal/modal.service';
import {ICustomer, IOrder} from '../../shared/interfaces';
import {GrowlerMessageType, GrowlerService} from '../../core/growler/growler.service';
import {LoggerService} from '../../core/services/logger.service';

@Component({
  selector: 'cm-customer-edit',
  templateUrl: './order-add..component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {

  addAnotherProduct = true;
  customer: ICustomer;
  order: IOrder =
    {
      productName: '',
      itemCost: 0
    };
  errorMessage: string;
  operationText = 'Add Order';
  @ViewChild('orderForm', {static: true}) orderForm: NgForm;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService,
              private growler: GrowlerService,
              private modalService: ModalService,
              private logger: LoggerService) {
  }

  ngOnInit() {
    // Subscribe to params so if it changes we pick it up. Don't technically need that here
    // since param won't be changing while component is alive.
    // Could use this.route.parent.snapshot.params["id"] to simplify it.
    this.route.parent.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (id !== 0) {
        this.getCustomer(id);
      }
    });
  }

  getCustomer(id: number) {
    this.dataService.getCustomer(id).subscribe((customer: ICustomer) => {
      this.customer = customer;
    });
  }

  submit() {

    this.customer.orders.push(this.order);
    this.customer.orderTotal += this.order.itemCost;

    this.dataService.updateCustomer(this.customer)
      .subscribe((status: boolean) => {
          if (status) {
            // Mark form as pristine so that CanDeactivateGuard won't prompt before navigation
            this.orderForm.form.markAsPristine();
            this.growler.growl('Operation performed successfully.', GrowlerMessageType.Success);
            if (!this.addAnotherProduct) {
              this.router.navigate(['/orders']);
            }
          } else {
            const msg = 'Unable to update customer';
            this.growler.growl(msg, GrowlerMessageType.Danger);
            this.errorMessage = msg;
          }
        },
        (err: any) => this.logger.log(err));
    this.order = {
      productName: '',
      itemCost: 0
    };
  }

  cancel(event: Event) {
    event.preventDefault();
    // Route guard will take care of showing modal dialog service if data is dirty
    this.router.navigate(['/orders']);
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.orderForm.dirty) {
      return true;
    }

    // Dirty show display modal dialog to user to confirm leaving
    const modalContent: IModalContent = {
      header: 'Lose Unsaved Changes?',
      body: 'You have unsaved changes! Would you like to leave the page and lose them?',
      cancelButtonText: 'Cancel',
      OKButtonText: 'Leave'
    };
    return this.modalService.show(modalContent);
  }

  ordersTrackBy(index: number, orderItem: any) {
    return index;
  }

}
