import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ToastService } from '../../shared/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { LucideAngularModule, UploadCloud, Image as ImageIcon, MapPin, Calendar, FileText } from 'lucide-angular';

@Component({
  selector: 'app-report-item',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    LoaderComponent,
    LucideAngularModule
  ],
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.scss']
})
export class ReportItemComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private router = inject(Router);

  type: 'lost' | 'found' = 'lost';
  isLoading = false;
  selectedImage: string | ArrayBuffer | null = null;
  isDragging = false;

  readonly UploadCloudIcon = UploadCloud;
  readonly ImageIcon = ImageIcon;
  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly FileTextIcon = FileText;

  categories = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Other'];

  reportForm = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    date: [new Date(), Validators.required],
    location: ['', Validators.required],
    description: ['', Validators.required],
    handoverChoice: ['keep'], // only for 'found' items
  });

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.type = data['type'];
      }
    });
  }

  get pageTitle() {
    return this.type === 'lost' ? 'Report Lost Item' : 'Report Found Item';
  }

  get pageSubtitle() {
    return this.type === 'lost' 
      ? "Lost something? Provide the details below to help us find it."
      : "Found something? Thank you for helping! Provide the details below.";
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.toast.error('Please upload an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result || null;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedImage = null;
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields.');
      return;
    }

    if (!this.selectedImage) {
      this.toast.error('Please upload an image of the item.');
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.toast.success(`Successfully reported ${this.type} item!`);
      this.router.navigate(['/items']);
    }, 1500);
  }
}
