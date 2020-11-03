import ErrorWithCode from './ErrorWithCode';

export default class ErrorCertificateUnvalid extends ErrorWithCode {
  constructor(clientCN: string, certIssuerCN: string) {
    const message = `Sorry ${clientCN}, certificates from ${certIssuerCN} are not authorized here.`;
    super(message, 'AUTH.CERTIFICATE_UNVALID');
  }
}
