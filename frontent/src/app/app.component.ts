import { Component, OnInit, OnDestroy, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  @Input() url: string = '/api/words';
  words: string = '';
  eventSource: EventSource | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {}

  startStream() {
    this.words = '';
    if (!this.url) {
      console.error('URL is not defined');
      return;
    }

    if (!this.eventSource) {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onmessage = (event) => {
        if (event.data === 'EOF') {
          this.eventSource?.close();
          this.eventSource = null;
        } else {
          try {
            const word = event.data.trim();
            this.ngZone.run(() => {
              this.words += word + ' ';
            });
          } catch (error) {
            console.error('Error parsing event data:', error);
            this.eventSource?.close();
            this.eventSource = null;
          }
        }
      };

      this.eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        this.eventSource?.close();
        this.eventSource = null;
      };
    }
  }

  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
