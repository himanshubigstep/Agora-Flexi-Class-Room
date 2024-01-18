import { observable, action } from 'mobx';

class TranscriptionStore {
  @observable
  transcriptions = [];

  @observable
  userNames = [];

  @action
  addTranscription(transcription, userName) {
    this.transcriptions.push(transcription);
    this.userNames.push(userName);
  }
}

const transcriptionStore = new TranscriptionStore();

export default transcriptionStore;
