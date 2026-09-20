import { IInvoice, IOrganization, IOrganizationContact } from '@gauzy/contracts';
export declare function generatePdf(invoice: IInvoice, organization: IOrganization, organizationContact: IOrganizationContact, service?: any, translatedText?: any): Promise<{
    content: (string | {
        columns: {
            width: string;
            text: string;
        }[];
        table?: undefined;
    } | {
        table: {
            widths: any;
            body: any[];
        };
        columns?: undefined;
    })[];
}>;
