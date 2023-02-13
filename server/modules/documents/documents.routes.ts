import * as express from 'express';

import { documentsCtrl } from './documents.controller';

export function setDocumentsRoutes(router: express.Router) {

  router.route('/documents').get(documentsCtrl.getDocuments);
  router.route('/documents').post(documentsCtrl.createDocument);
  router.route('/documents/upload').post(documentsCtrl.uploadDocument);
  router.route('/documents/:id').get(documentsCtrl.getDocument);
  router.route('/documents/:id').post(documentsCtrl.saveDocument);
  router.route('/documents/:id').put(documentsCtrl.updateDocument);
  router.route('/documents/:id').delete(documentsCtrl.deleteDocument);
  router.route('/documents/:id/favorite').post(documentsCtrl.setDocumentFavorite);
  router.route('/documents/:id/share').post(documentsCtrl.shareDocument);
  router.route('/documents/:id/download').get(documentsCtrl.downloadDocument);

}
