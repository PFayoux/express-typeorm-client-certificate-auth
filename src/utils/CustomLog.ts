export default class CustomLog {
  static debug(message: string, error?: Error): void {
    console.debug(`${Date().toLocaleString()} : ${message}`);
    if (error) console.debug(error);
  }

  static info(message: string, error?: Error): void {
    console.info(`${Date().toLocaleString()} : ${message}`);
    if (error) console.info(error);
  }

  static warn(message: string, error?: Error): void {
    console.warn(`${Date().toLocaleString()} : ${message}`);
    if (error) console.warn(error);
  }

  static error(message: string, error?: Error): void {
    console.error(`${Date().toLocaleString()} : ${message}`);
    if (error) console.error(error);
  }
}
