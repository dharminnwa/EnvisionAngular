// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //NodeapiURL: 'http://localhost:1338/api',
  // NodeapiURL: 'http://ec2-54-86-0-214.compute-1.amazonaws.com:1338/api',
  //NodeapiURL: 'http://54.86.0.214:1438/api',
  NodeapiURL: 'https://node.envisionmaps.net/api',
  apiURL: 'https://api.envisionmaps.com:8080/api',
  GetLayerIconURL: 'https://node.envisionmaps.net/api',
  aggridLicenseKey: 'Evaluation_License_Valid_Until__17_November_2018__MTU0MjQxMjgwMDAwMA==e6e57614394e82591f7af9baff0981a4',
  // AmazonAPiURL: 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod/api',
  //ImagespreviewPath: 'https://api.envisionmaps.com:8080/Images/',
  ImagespreviewPath: 'https://node.envisionmaps.net/Images/',
  GooglemapAPIKey: 'AIzaSyCdCw-UMwdjTOzXPaelRVOSSzvhpspTgCU',
  //GooglemapAPIKey: 'AIzaSyCeATITCHsq8m12aW4u6Yv29MJb_RzM7tI'

};
