import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LucideAngularModule, Search, PlusCircle, CheckCircle, ShieldCheck, Zap, Users } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, LucideAngularModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  readonly SearchIcon = Search;
  readonly PlusCircleIcon = PlusCircle;
  readonly CheckCircleIcon = CheckCircle;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly ZapIcon = Zap;
  readonly UsersIcon = Users;
}
