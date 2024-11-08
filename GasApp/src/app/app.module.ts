import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GasListComponent } from './components/gas-list/gas-list.component';
import { MenuComponent } from './shared/menu/menu.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EuroPipe } from './pipes/euro.pipe';
import { GoogleMapsLinkPipe } from './pipes/google-maps-link.pipe';
import { GoogleMapRoutePipe } from './pipes/google-maps-route.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [AppComponent,GasListComponent,MenuComponent, EuroPipe, GoogleMapsLinkPipe, GoogleMapRoutePipe],
  imports: [BrowserModule,AppRoutingModule,NgbModule,MaterialModule,FormsModule, MatAutocompleteModule, ReactiveFormsModule],

  providers: [provideHttpClient(), provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
