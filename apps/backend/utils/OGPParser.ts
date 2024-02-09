export class OGPParser {
    ogpTitle: string;
    ogpDescription: string;
    ogpImageUrl: string;
    ogpSiteName: string;

    constructor() {
        this.ogpTitle = "";
        this.ogpDescription = "";
        this.ogpImageUrl = "";
        this.ogpSiteName = "";
    }
    element(element: Element) {
        switch (element.getAttribute("property")) {
            case "og:title":
                this.ogpTitle = element.getAttribute("content") ?? "";
                break;
            case "og:description":
                this.ogpDescription = element.getAttribute("content") ?? "";
                break;
            case "og:image":
                this.ogpImageUrl = element.getAttribute("content") ?? "";
                break;
            case "og:site_name":
                this.ogpSiteName = element.getAttribute("content") ?? "";
                break;
            default:
                break;
        }
    }
}