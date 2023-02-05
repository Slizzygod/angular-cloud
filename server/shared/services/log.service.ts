import { Log } from "../../core/models";

class LogService {

  async createLog(log: any): Promise<any> {
    return await Log.create(log);
  }

}

export const logService = new LogService();
