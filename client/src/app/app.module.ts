import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { FanficsService } from './services/fanfics.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { FanficsComponent } from './components/fanfics/fanfics.component';
import { EditFanficComponent } from './components/fanfics/edit-fanfic/edit-fanfic.component';
import { DeleteFanficComponent } from './components/fanfics/delete-fanfic/delete-fanfic.component';
import { ViewFanficComponent } from './components/fanfics/view-fanfic/view-fanfic.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageUploadModule } from "angular2-image-upload";
import { FileDropModule } from 'ngx-file-drop';
/*import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';*/


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    FanficsComponent,
    EditFanficComponent,
    DeleteFanficComponent,
    ViewFanficComponent,
    //FileUploadModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TagInputModule,
    BrowserAnimationsModule,
    ImageUploadModule.forRoot(),
    FileDropModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, FanficsService],
  bootstrap: [AppComponent]
})
export class AppModule { }