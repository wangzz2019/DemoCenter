
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: 'xxx',
    clientToken: 'xxx',
    site: 'datadoghq.com',
    service: 'democenter',
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true
});
