import "./FAQs.scss";
import { useState } from "react";
import { faqData } from "../../assets/assets";

export const FAQs = () => {
  const [isOpen, setIsOpen] = useState<number[]>([]);

  const openFAQ = (index: number) => {
    setIsOpen((prev) => {
      const newIsOpen = [...prev];
      if (newIsOpen.includes(index)) {
        newIsOpen.splice(newIsOpen.indexOf(index), 1);
      } else {
        newIsOpen.push(index);
      }
      return newIsOpen;
    });
  };

  return (
    <div className="FAQs_container">
      <div className="FAQs_container_header">
        <h1>Frequently Asked Questions</h1>
        <p>
          Quick answers to questions you may have about the Flirty platform.
        </p>
      </div>
      <div className="FAQs">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`FAQ ${isOpen.includes(index) ? "open" : ""}`}
            onClick={() => openFAQ(index)}
          >
            <div className="faq-header">
              <i
                className={`fa fa-chevron-${
                  isOpen.includes(index) ? "up" : "down"
                }`}
              ></i>
              <h3>{faq.question}</h3>
            </div>
            {isOpen.includes(index) && <p>{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
