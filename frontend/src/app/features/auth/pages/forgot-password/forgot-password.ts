import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({ selector:'app-forgot-password', standalone:true, imports:[ReactiveFormsModule,RouterLink], templateUrl:'./forgot-password.html', styleUrl:'./forgot-password.scss' })
export class ForgotPassword {
  private fb=inject(FormBuilder); private auth=inject(AuthService);
  loading=signal(false); otpSent=signal(false); completed=signal(false); errorMessage=signal(''); hidePassword=signal(true);
  recoveryForm=this.fb.nonNullable.group({
    phoneNumber:['',[Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
    otp:['',[Validators.required,Validators.pattern(/^\d{6}$/)]],
    newPassword:['',[Validators.required,Validators.minLength(8)]],
    confirmPassword:['',Validators.required]
  });
  sendOtp():void {
    const phone=this.recoveryForm.controls.phoneNumber; phone.markAsTouched();
    if(phone.invalid||this.loading()) return;
    this.loading.set(true); this.errorMessage.set('');
    this.auth.requestPasswordReset(phone.value).subscribe({next:()=>{this.loading.set(false);this.otpSent.set(true);},
      error:e=>{this.loading.set(false);this.errorMessage.set(e?.error?.message||'Could not send OTP. Please try again shortly.');}});
  }
  resetPassword():void {
    if(this.loading()) return; this.recoveryForm.markAllAsTouched(); if(this.recoveryForm.invalid) return;
    const {phoneNumber,otp,newPassword,confirmPassword}=this.recoveryForm.getRawValue();
    if(newPassword!==confirmPassword){this.errorMessage.set('Your passwords do not match.');return;}
    this.loading.set(true);this.errorMessage.set('');
    this.auth.resetPassword(phoneNumber,otp,newPassword).subscribe({next:()=>{this.loading.set(false);this.completed.set(true);},
      error:e=>{this.loading.set(false);this.errorMessage.set(e?.error?.message||'OTP verification failed. Request a new OTP and try again.');}});
  }
}