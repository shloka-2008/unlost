import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule, User, Settings, ShieldCheck, Clock, MapPin, Search } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    LucideAngularModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  readonly UserIcon = User;
  readonly SettingsIcon = Settings;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly ClockIcon = Clock;
  readonly MapPinIcon = MapPin;
  readonly SearchIcon = Search;

  user = {
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    joined: new Date('2025-08-15')
  };

  reportedItems = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max',
      status: 'lost',
      date: new Date(Date.now() - 86400000 * 2),
      imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      title: 'Blue Water Bottle',
      status: 'claimed',
      date: new Date(Date.now() - 86400000 * 15),
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80'
    }
  ];

  myClaims = [
    {
      id: '101',
      itemTitle: 'Black North Face Jacket',
      status: 'pending',
      dateSubmitted: new Date(Date.now() - 86400000),
      imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=400&q=80'
    }
  ];

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'found': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'claimed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
