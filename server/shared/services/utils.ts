class UtilsService {

  encodeBase64(data: string) {
    return Buffer.from(data).toString('base64');
  }

  decodeBase64(data: string) {
    return Buffer.from(data, 'base64').toString('ascii');
  }

}

export const utilsService = new UtilsService();
