import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GasListComponent } from './components/gas-list/gas-list.component';
import { MenuComponent } from './shared/menu/menu.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EuroPipe } from './pipes/euro.pipe';
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  declarations: [AppComponent,GasListComponent,MenuComponent, EuroPipe, FilterComponent],
  imports: [BrowserModule,AppRoutingModule,NgbModule,MaterialModule,FormsModule],

  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
