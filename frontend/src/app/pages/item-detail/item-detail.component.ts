import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../shared/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { LucideAngularModule, Calendar, MapPin, Tag, ShieldCheck, MessageSquare, ArrowLeft } from 'lucide-angular';

interface Item {
  id: string;
  title: string;
  category: string;
  status: 'lost' | 'found' | 'claimed' | 'archived';
  date: Date;
  location: string;
  description: string;
  imageUrl: string;
  reportedBy: string;
  handoverChoice?: string;
}

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    LucideAngularModule,
    LoaderComponent
  ],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  readonly CalendarIcon = Calendar;
  readonly MapPinIcon = MapPin;
  readonly TagIcon = Tag;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly MessageSquareIcon = MessageSquare;
  readonly ArrowLeftIcon = ArrowLeft;

  item: Item | null = null;
  isLoading = false;
  isClaiming = false;
  claimSubmitted = false;

  claimForm = this.fb.group({
    proof: ['', Validators.required],
    contactNumber: ['', Validators.required]
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadItemDetails(id);
    });
  }

  loadItemDetails(id: string | null) {
    if (!id) return;
    
    // Dummy Data
    this.item = {
      id: id,
      title: 'iPhone 13 Pro Max',
      category: 'Electronics',
      status: 'found',
      date: new Date(Date.now() - 86400000 * 2),
      location: 'Library 2nd Floor, near stairs',
      description: 'Found a blue iPhone 13 Pro Max with a clear case. The screen has a small scratch on the top right corner. It was found on the second desk near the main staircase.',
      imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
      reportedBy: 'Alex J.',
      handoverChoice: 'admin'
    };
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'found': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'claimed': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  startClaim() {
    this.isClaiming = true;
  }

  cancelClaim() {
    this.isClaiming = false;
    this.claimForm.reset();
  }

  submitClaim() {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Simulate API Call
    setTimeout(() => {
      this.isLoading = false;
      this.isClaiming = false;
      this.claimSubmitted = true;
      this.toast.success('Claim request submitted successfully! The admin will review it.');
    }, 1500);
  }
}
