// text-to-image.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-text-to-image',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './text-to-image.component.html',
  styleUrls: ['./text-to-image.component.css']
})
export class TextToImageComponent {

  imageForm: FormGroup;
  generatedImage: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  aspectRatioOptions = ['763*1344', '1024*1024', '1152*896', '896*1152', '1216*832', '832*1216', '1344*768', '768*1344'];
  performanceOptions = ['Quality', 'Speed', 'Balanced'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.imageForm = this.fb.group({
      prompt: ['', [Validators.required]],
      negative_prompt: ['blurry, low quality, extra limbs,poor quality'],
      aspect_ratios_selection: ['763*1344'],
      performance_selection: ['Speed'],
      num_inference_steps: [30],
      guidance_scale: [4]
    });
  }

  generateImage() {
    if (this.imageForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.generatedImage = null;

    const payload = this.imageForm.value;
    const apiUrl = 'https://192.168.1.6:7860/v1/generation/text-to-image';

    this.http.post<any[]>(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        if (response && response.length > 0 && response[0].url) {
          const imageUrl = response[0].url;

          // Option 1: Just use the URL directly
          this.generatedImage = imageUrl;

          // Option 2: If you need a DataURL
          // this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
          //   const reader = new FileReader();
          //   reader.onload = () => {
          //     this.generatedImage = reader.result as string;
          //   };
          //   reader.readAsDataURL(blob);
          // });

        } else {
          this.errorMessage = 'Image URL not found in response.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to generate image. Please try again.';
      }
    });
  }



  downloadImage() {
    if (!this.generatedImage) return;
    const link = document.createElement('a');
    link.href = this.generatedImage;
    link.download = `generated-image-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
