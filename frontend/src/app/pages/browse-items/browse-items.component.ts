import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule, Search, Grid, List, MapPin, Calendar, LayoutGrid } from 'lucide-angular';

interface Item {
  id: string;
  title: string;
  category: string;
  status: 'lost' | 'found' | 'claimed' | 'archived';
  date: Date;
  location: string;
  imageUrl: string;
}

@Component({
  selector: 'app-browse-items',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    LucideAngularModule
  ],
  templateUrl: './browse-items.component.html',
  styleUrls: ['./browse-items.component.scss']
})
export class BrowseItemsComponent implements OnInit {
  private fb = inject(FormBuilder);

  viewMode: 'grid' | 'list' = 'grid';
  
  readonly SearchIcon = Search;
  readonly LayoutGridIcon = LayoutGrid;
  readonly ListIcon = List;
  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;

  categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Other'];
  statuses = ['All', 'Lost', 'Found', 'Claimed'];

  filterForm = this.fb.group({
    search: [''],
    category: ['All'],
    status: ['All'],
    sortBy: ['newest']
  });

  // Dummy data
  allItems: Item[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max',
      category: 'Electronics',
      status: 'lost',
      date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      location: 'Library 2nd Floor',
      imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      title: 'Black North Face Jacket',
      category: 'Clothing',
      status: 'found',
      date: new Date(Date.now() - 86400000 * 5),
      location: 'Cafeteria',
      imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      title: 'Student ID Card',
      category: 'Documents',
      status: 'claimed',
      date: new Date(Date.now() - 86400000 * 10),
      location: 'Engineering Building',
      imageUrl: 'https://images.unsplash.com/photo-1563209259-281ce1c790b4?auto=format&fit=crop&w=400&q=80'
    }
  ];

  filteredItems: Item[] = [];

  ngOnInit() {
    this.applyFilters();

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters() {
    const { search, category, status, sortBy } = this.filterForm.value;
    
    let result = [...this.allItems];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      result = result.filter(item => item.category === category);
    }

    if (status && status !== 'All') {
      result = result.filter(item => item.status === status.toLowerCase());
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    this.filteredItems = result;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'lost': return 'warn';
      case 'found': return 'primary';
      case 'claimed': return 'accent';
      default: return '';
    }
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
}
