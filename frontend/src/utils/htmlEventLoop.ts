export const htmlEventLoop = (htmlElement : string, eventString: string, eventFunction: EventListener) => {
    const images = document.getElementsByClassName(htmlElement) as HTMLCollectionOf<HTMLButtonElement>;
    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      element.addEventListener(eventString, eventFunction);
    }
}