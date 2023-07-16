import { Component } from '@angular/core';
import Peer from 'peerjs';


@Component({
  selector: 'app-call-buttons',
  templateUrl: './call-buttons.component.html',
  styleUrls: ['./call-buttons.component.css']
})

export class CallButtonsComponent {
  peer = new Peer();
  currentCall : any;
  uuid = '';
  peerID = '';

  constructor() {
    this.peer.on('open', (id) => {
      this.uuid = id;
    });
  }

  async callUser () {
    const peerID = this.peerID;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    document.getElementById('joinButtons')!.style.display = 'none';
    document.getElementById('live')!.style.display = 'block';
    (document.getElementById('local-video') as HTMLVideoElement).srcObject = stream;
    (document.getElementById('local-video') as HTMLVideoElement).play();

    const call = this.peer.call(peerID, stream);
    call.on('stream', (stream) => {
      (document.getElementById('remote-video') as HTMLVideoElement).srcObject = stream;
      (document.getElementById('remote-video') as HTMLVideoElement).play();
    });

    call.on('error', (err) => {
      console.log(err);
    });

    call.on('close', () => {
      this.endCall();
    });

    this.currentCall = call;
  }

  endCall() {
    (document.querySelector('#menu') as HTMLElement).style.display = 'block';
    (document.querySelector('#live') as HTMLElement).style.display = 'none';
    
    if (!this.currentCall) 
      return;
    
    try {
      this.currentCall.close();
    } 
    catch {}

    this.currentCall = undefined;
  }

  ngOnInit() {
    this.peer.on('call', (call) => {
      if (confirm(`Accept call from ${call.peer}?`)) {
        // grab the camera and mic
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            // play the local preview
            (document.querySelector(
              '#local-video'
            ) as HTMLVideoElement).srcObject = stream;
            (document.querySelector('#local-video') as HTMLVideoElement).play();
            // answer the call
            call.answer(stream);
            // save the close function
            this.currentCall = call;
            // change to the video view
            (document.querySelector('#menu') as HTMLElement).style.display = 'none';
            (document.querySelector('#live') as HTMLElement).style.display = 'block';
            call.on('stream', (remoteStream) => {
              // when we receive the remote stream, play it
              (document.getElementById(
                'remote-video'
              ) as HTMLVideoElement).srcObject = remoteStream;
              (document.getElementById(
                'remote-video'
              ) as HTMLVideoElement).play();
            });
          })
          .catch((err) => {
            console.log('Failed to get local stream:', err);
          });
      } 
      else {
        call.close();
      }
    });
  }
}
