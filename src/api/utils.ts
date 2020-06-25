export function findVisibleElement(selector: string | undefined) {
    if (selector) {
        const isVisible = (elem: HTMLElement) =>
            !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

        const elementList = document.querySelectorAll(selector)

        for (let i = 0; i < elementList.length; i++) {
            const el = elementList[i] as HTMLElement
            if (isVisible(el)) {
                return el
            }
        }
    }

    return null
}
