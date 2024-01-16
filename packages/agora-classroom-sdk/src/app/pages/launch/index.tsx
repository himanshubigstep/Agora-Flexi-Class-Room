import { AgoraEduSDK } from '@/infra/api';
import { useHomeStore } from '@/infra/hooks';
import { GlobalStorage } from '@/infra/utils';
import { AgoraEduClassroomEvent, EduRoomSubtypeEnum } from 'agora-edu-core';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import courseWareList from './courseware-list';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';



export const LaunchPage = observer(() => {
  const homeStore = useHomeStore();

  const history = useHistory();

  const launchOption = homeStore.launchOption || {};

  useEffect(() => {
    if (isEmpty(launchOption)) {
      history.push('/');
      return;
    }
  }, []);

  const mountLaunch = useCallback(async (dom: HTMLDivElement) => {
    if (dom) {
      AgoraEduSDK.setParameters(
        JSON.stringify({
          host: homeStore.launchOption.sdkDomain,
          uiConfigs: homeStore.launchOption.scenes,
          themes: homeStore.launchOption.themes
        }),
      );

      AgoraEduSDK.config({
        appId: launchOption.appId,
        region: launchOption.region ?? 'CN',
      });

      // const recordUrl = `https://solutions-apaas.agora.io/apaas/record/dev/${CLASSROOM_SDK_VERSION}/record_page.html`;
      const recordUrl = `https://agora-adc-artifacts.s3.cn-north-1.amazonaws.com.cn/apaas/record/dev/${CLASSROOM_SDK_VERSION}/record_page.html`;
      AgoraEduSDK.launch(dom, {
        ...launchOption,
        // TODO:  Here you need to pass in the address of the recording page posted by the developer himself
        recordUrl,
        courseWareList,
        uiMode: homeStore.theme,
        listener: (evt: AgoraEduClassroomEvent, type) => {
          console.log('launch#listener ', evt);
          if (
            evt === AgoraEduClassroomEvent.Destroyed &&
            launchOption.roomSubtype === EduRoomSubtypeEnum.Vocational
          ) {
            const url = `/vocational${GlobalStorage.read('platform') == 'h5' ? '/h5login' : ''
              }?reason=${type}`;
            history.push(url);
            return;
          }
          if (evt === AgoraEduClassroomEvent.Destroyed) {
            // history.push(`/?reason=${type}`);
            // history.push('/transcript_log', '_blank')
            if (isEmpty(transcriptionStore.transcriptions) && isEmpty(transcriptionStore.userNames)) {
              history.push(`/?reason=${type}`);
            } else {
              // If either transcriptions or userNames is not empty, open the transcript log
              history.push('/transcript_log', '_blank');
            }
          }
        },
      });
    }
  }, []);

  return (
    <div
      ref={mountLaunch}
      id="app"
      className="bg-background"
      style={{ width: '100%', height: '100%' }}></div>
  );
});
