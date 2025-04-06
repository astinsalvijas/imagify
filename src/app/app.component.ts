import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextToImageComponent } from './text-to-image/text-to-image.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule,TextToImageComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>AI Image Generator</h1>
      </header>
      <main>
        <app-text-to-image></app-text-to-image>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 100%;
      margin: 0;
      padding: 20px;
    }

    header {
      text-align: center;
      margin-bottom: 20px;
    }

    h1 {
      color: #333;
      margin: 0;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
