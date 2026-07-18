import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../shared/services/toast.service';
import { LucideAngularModule, Users, FileText, CheckCircle, AlertTriangle, Archive, Trash2, Check, X } from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    LucideAngularModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  private toast = inject(ToastService);

  readonly UsersIcon = Users;
  readonly FileTextIcon = FileText;
  readonly CheckCircleIcon = CheckCircle;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly ArchiveIcon = Archive;
  readonly Trash2Icon = Trash2;
  readonly CheckIcon = Check;
  readonly XIcon = X;

  // Analytics Data
  stats = {
    totalReported: 124,
    totalClaimed: 89,
    resolutionRate: '72%',
    activeUsers: 450
  };

  // Moderation Queue
  displayedColumnsItems: string[] = ['image', 'title', 'category', 'status', 'reportedBy', 'actions'];
  itemsQueue = [
    { id: '1', title: 'iPhone 13 Pro Max', category: 'Electronics', status: 'lost', reportedBy: 'Alex J.', imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=100&q=80' },
    { id: '2', title: 'Black North Face Jacket', category: 'Clothing', status: 'found', reportedBy: 'Admin', imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=100&q=80' }
  ];

  // Claims Queue
  displayedColumnsClaims: string[] = ['item', 'claimant', 'contact', 'proof', 'actions'];
  claimsQueue = [
    { id: '101', itemTitle: 'Black North Face Jacket', claimant: 'Jane Doe', contact: '+1 (555) 123-4567', proof: 'I can describe the items in the pockets: a blue pen and a pack of gum.' }
  ];

  approveClaim(id: string) {
    this.toast.success(`Claim ${id} approved successfully!`);
    this.claimsQueue = this.claimsQueue.filter(c => c.id !== id);
  }

  rejectClaim(id: string) {
    this.toast.info(`Claim ${id} rejected.`);
    this.claimsQueue = this.claimsQueue.filter(c => c.id !== id);
  }

  archiveItem(id: string) {
    this.toast.success(`Item ${id} archived globally.`);
    this.itemsQueue = this.itemsQueue.filter(i => i.id !== id);
  }

  deleteItem(id: string) {
    this.toast.info(`Item ${id} deleted.`);
    this.itemsQueue = this.itemsQueue.filter(i => i.id !== id);
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'lost': return 'bg-red-100 text-red-800';
      case 'found': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
