import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { OtpComponent } from './otp/otp.component';
import { RouterModule } from '@angular/router';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { NgOtpInputModule } from  'ng-otp-input';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { ContinueForPartnerComponent } from './continue-for-partner/continue-for-partner.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectChannelComponent } from './select-channel/select-channel.component';
import { AgmCoreModule } from '@agm/core';
import { SelectLocationComponent } from './select-location/select-location.component';
import { SavedLocationComponent } from './saved-location/saved-location.component';
import { UpdateNumberComponent } from './update-number/update-number.component';
import { OTPVerifyComponent } from './otp-verify/otp-verify.component';
import { FilterPriceComponent } from './filter-price/filter-price.component';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { OpenLocationComponent } from './open-location/open-location.component';
import { UserSelectChannelComponent } from './user-select-channel/user-select-channel.component';
import { SavedAddressComponent } from './saved-address/saved-address.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SelectUserlocationComponent } from './select-userlocation/select-userlocation.component';
import { UserAddAddressComponent } from './user-add-address/user-add-address.component';
@NgModule({
  declarations: [
    LoginComponent,
    OtpComponent,
    CreateProfileComponent,
    ContinueForPartnerComponent,
    LocationDialogComponent,
    SelectChannelComponent,
    SelectLocationComponent,
    SavedLocationComponent,
    UpdateNumberComponent,
    OTPVerifyComponent,
    FilterPriceComponent,
    PromoCodeComponent,
    AddAddressComponent,
    OpenLocationComponent,
    UserSelectChannelComponent,
    SavedAddressComponent,
    SelectUserlocationComponent,
    UserAddAddressComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgOtpInputModule,
    Ng2TelInputModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(),
    NgxSliderModule
  ],

  exports:[
    LoginComponent,
    OtpComponent,
    CreateProfileComponent
  ]

})

export class DialogModuleModule { }
