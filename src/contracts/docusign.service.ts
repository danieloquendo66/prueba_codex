// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import * as docusign from 'docusign-esign';
import { readFileSync } from 'fs';

@Injectable()
export class DocuSignService {
  private readonly logger = new Logger(DocuSignService.name);
  private apiClient: docusign.ApiClient;

  constructor() {
    const authServer = process.env.DOCUSIGN_AUTH_SERVER; // e.g., account-d.docusign.com
    const basePath = process.env.DOCUSIGN_BASE_PATH; // e.g., https://demo.docusign.net/restapi
    this.apiClient = new docusign.ApiClient();
    if (authServer) {
      this.apiClient.setOAuthBasePath(authServer.replace(/^https?:\/\//, ''));
    }
    if (basePath) {
      this.apiClient.setBasePath(basePath);
    }
  }

  private async authenticate(): Promise<string> {
    const integratorKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const privateKeyPath = process.env.DOCUSIGN_PRIVATE_KEY_PATH;
    const scopes = ['signature'];
    const expiresIn = 3600;
    const privateKey = readFileSync(privateKeyPath || '', 'utf8');
    const authResponse = await this.apiClient.requestJWTUserToken(
      integratorKey || '',
      userId || '',
      scopes,
      Buffer.from(privateKey),
      expiresIn,
    );
    const accessToken = authResponse.body.access_token;
    this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
    return accountId || '';
  }

  async createEnvelopeFromHtml(
    htmlContent: string,
    recipientEmail: string,
    recipientName: string,
    returnUrl: string,
  ): Promise<{ envelopeId: string; signingUrl: string }> {
    const accountId = await this.authenticate();
    const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
    const docBase64 = Buffer.from(htmlContent).toString('base64');
    const document = docusign.Document.constructFromObject({
      documentBase64: docBase64,
      name: 'Contract',
      fileExtension: 'html',
      documentId: '1',
    });
    const signHere = docusign.SignHere.constructFromObject({
      documentId: '1',
      pageNumber: '1',
      recipientId: '1',
      xPosition: '100',
      yPosition: '150',
    });
    const signer = docusign.Signer.constructFromObject({
      email: recipientEmail,
      name: recipientName,
      recipientId: '1',
      clientUserId: '1',
      tabs: docusign.Tabs.constructFromObject({ signHereTabs: [signHere] }),
    });
    const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
      emailSubject: 'Por favor firme este contrato',
      documents: [document],
      recipients: docusign.Recipients.constructFromObject({ signers: [signer] }),
      status: 'sent',
    });
    const envelopeSummary = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
    const envelopeId = envelopeSummary.envelopeId as string;
    const viewRequest = docusign.RecipientViewRequest.constructFromObject({
      authenticationMethod: 'none',
      clientUserId: '1',
      recipientId: '1',
      returnUrl,
      userName: recipientName,
      email: recipientEmail,
    });
    const viewResponse = await envelopesApi.createRecipientView(
      accountId,
      envelopeId,
      { recipientViewRequest: viewRequest },
    );
    return { envelopeId, signingUrl: viewResponse.url as string };
  }
}