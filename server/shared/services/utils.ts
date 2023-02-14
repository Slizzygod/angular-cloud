class UtilsService {

  encodeBase64(data: string) {
    return Buffer.from(data).toString('base64');
  }

  decodeBase64(data: string) {
    return Buffer.from(data, 'base64').toString('ascii');
  }

  formatBytes(bytes: number, decimals = 2) {
    if (!bytes) {
      return '0 Байт';
    }

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

}

export const utilsService = new UtilsService();
