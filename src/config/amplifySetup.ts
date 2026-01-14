import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplifyConfig';

Amplify.configure(amplifyConfig);

export default Amplify;
