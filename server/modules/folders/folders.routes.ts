import * as express from 'express';

import { foldersCtrl } from './folders.controller';

export function setFoldersRoutes(router: express.Router) {

  router.route('/folders').get(foldersCtrl.getFolders);
  router.route('/folders').post(foldersCtrl.createFolder);
  router.route('/folders/:id').put(foldersCtrl.updateFolder);
  router.route('/folders/:id').delete(foldersCtrl.deleteFolder);

}
