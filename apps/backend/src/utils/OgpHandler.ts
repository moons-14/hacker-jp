export class OgpHandler {
    image: string;
    description: string;

    constructor() {
        this.image = '';
        this.description = '';
    }

    element(element: Element) {
        const property = element.getAttribute('property');

        if (property === 'og:description') {
            this.description = element.getAttribute('content') ?? '';
        } else if (property === 'og:image') {
            this.image = element.getAttribute('content') ?? '';
        }
    }
}