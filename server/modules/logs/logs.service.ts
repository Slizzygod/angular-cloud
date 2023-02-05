import { Log } from "../../core/models";

class LogsService {

  async createLog(log: any): Promise<any> {
    return await Log.create(log);
  }

}

export const logsService = new LogsService();
