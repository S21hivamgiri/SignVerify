import { Component, HostListener, OnInit } from '@angular/core';
import { PredictionService } from '../prediction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private predictionService: PredictionService) { }
  uploading = false;
  gettingUid = false;
  fileAdded = false;
  cameraCapturing = false;
  uid = "";
  stream?: MediaStream;
  name = '';
  isNewUserAdded = false;

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    let clipData = e.clipboardData || (window as any).clipboardData;
    let blob = null;
    for (const item of clipData.items) {
      if (item.type.indexOf('image') == 0) {
        blob = item.getAsFile();
      }
    }
    this.createImage(blob)
  }
  uploaded = false;

  ngOnInit(): void {
  }
  

  submitImage(isOldUser=false) {
    this.uploading = true;
    if (this.isNewUser) {
      const img = document.getElementById('output') as HTMLImageElement
      fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'dot.png', blob);
          this.isNewUser =false;
          this.predictionService.sendNewImageData(this.uid, file).subscribe(data => { 
            this.uploaded = true; 
            console.log(data); }
          );
        });

    } else {
      const img = document.getElementById('output') as HTMLImageElement
      fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'dot.png', blob);
          this.predictionService.sendImageData(this.uid, file, isOldUser).subscribe(data => { this.uploaded = true; 
            this.prediction = (data as {'result': string }).result as string; }
          );
        });
    }
  }

  isNewUser = false;
  prediction='';

  submitNewUser() {
    this.predictionService.createNewUser(this.uid, this.name).subscribe(data => {
      if (data.uid ) {
        this.gettingUid = true;
        this.isNewUserAdded =false;
      }
    });
  }

  submit() {
    this.predictionService.getDataforUID(this.uid).subscribe(data => {
      if (data.uid && data.name) {
        this.gettingUid = true;
        this.name=data.name;
      }
      else {
        this.isNewUser = true;
        this.isNewUserAdded =true;
      }
    });

  }

  handleFileSelect(event: Event) {
    this.createImage((event.target as HTMLInputElement).files?.[0])
  }

  createImage(data?: File | Blob | MediaSource) {
    let image = document.getElementById('output') as HTMLImageElement;
    image.height = 200;
    image.src = URL.createObjectURL(data!);
    this.fileAdded = true;
  }

  captureImage() {
    let vid = document.querySelector("#video") as HTMLVideoElement;
    const canvas = document.createElement('canvas'); // create a canvas
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx?.drawImage(vid, 0, 0); // the video
    let image = document.getElementById('output') as HTMLImageElement;
    image.height = 200;
    image.src = canvas.toDataURL('image/jpeg')!;
    this.fileAdded = true;
    this.cameraCapturing = false;
  }

  async createStream() {
    let video = document.querySelector("#video");
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    (video as HTMLVideoElement).srcObject = this.stream;
  }


  removeImage() {
    let image = document.getElementById('output') as HTMLImageElement;
    image.height = 0;
    image.src = '';
    this.stopStream();
    this.fileAdded = false;
    this.uploading = false;
    (document.getElementById('#inputGroupFile01') as HTMLInputElement).value = '';
  }

  stopStream() {
    this.stream?.getTracks().forEach(function (track) {
      if (track.readyState == 'live') {
        track.stop();
      }
    });
  }
}
