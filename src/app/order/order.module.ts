import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OrderRoutingModule } from './order-routing.module';

@NgModule({
  imports: [OrderRoutingModule, SharedModule],
  declarations: [OrderRoutingModule.components]
})
export class OrderModule { }
