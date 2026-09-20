/**
 * Starter content seeded once per organization (only when the org has zero `document` rows):
 * one root "Company Library" folder containing one "Welcome to Documents" page.
 * Plain seeded content — deliberately not i18n-keyed.
 */
export declare const STARTER_FOLDER: {
    name: string;
    icon: string;
};
export declare const STARTER_PAGE_NAME = "Welcome to Documents";
export declare const STARTER_PAGE_ICON = "\uD83D\uDC4B";
/**
 * The welcome page's canonical TipTap JSON document.
 */
export declare const STARTER_PAGE_CONTENT_JSON: {
    type: string;
    content: ({
        type: string;
        attrs: {
            level: number;
        };
        content: {
            type: string;
            text: string;
        }[];
    } | {
        type: string;
        content: {
            type: string;
            text: string;
        }[];
        attrs?: undefined;
    } | {
        type: string;
        content: {
            type: string;
            content: {
                type: string;
                content: {
                    type: string;
                    text: string;
                }[];
            }[];
        }[];
        attrs?: undefined;
    })[];
};
/**
 * The same content rendered as the HTML cache (kept in sync with the JSON above at seed time).
 */
export declare const STARTER_PAGE_CONTENT_HTML: string;
