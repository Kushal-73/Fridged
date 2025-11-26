import { useEffect } from 'react'
import './sprite.css'

const InfLog = () => {

    useEffect(() => {
        const inLineScript = document.createElement('script');
        inLineScript.textContent = `
                
        var scrollers = document.querySelectorAll(".scroller");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
        }
        function addAnimation() {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
            });
        });
        }`;

        document.body.appendChild(inLineScript);
        return () => {
            if (inLineScript.parentNode) {
            document.body.removeChild(inLineScript);
        }
        }
    }, []);

  return (
    <>
            <div className="container">
                <div className="scroller" data-speed="slow">
                    <ul className="tag-list scroller__inner yarndings-20-regular text-4xl tracking-widest ">
                    <li>Hcccvcvsbv sbs</li>
                    <li>aa3fvccljboieicmmsox</li>
                    <li>ad3hdjo04nujdk</li>
                    </ul>
                </div>
        </div> 
  </>
  )
}

export default InfLog