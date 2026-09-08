import { useRef, useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "What is SenPlay?",
    answer:
      "SenPlay is an entertainment application designed to bring different types of content together in one place.",
  },
  {
    question: "Where can I download SenPlay?",
    answer:
      "You can download SenPlay using the download button on this website.",
  },
  {
    question: "What devices does SenPlay support?",
    answer: "SenPlay is currently available for Android devices.",
  },
  // "Is SenPlay free?" intentionally omitted — add it back once
  // pricing / premium details are confirmed. Do not guess here.
  {
    question: "How do I get the latest version?",
    answer:
      "Always download the latest version of SenPlay from this official website.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const panelRefs = useRef([]);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleKeyDown = (event, index) => {
    const { key } = event;
    if (key !== "ArrowDown" && key !== "ArrowUp") return;

    event.preventDefault();
    const nextIndex =
      key === "ArrowDown"
        ? (index + 1) % faqData.length
        : (index - 1 + faqData.length) % faqData.length;

    const buttons =
      panelRefs.current[0]?.parentElement?.querySelectorAll(".faq__question");
    buttons?.[nextIndex]?.focus();
  };

  return (
    <section id="faq" className="faq" aria-labelledby="faq-heading">
      <div className="faq__container">
        <div className="faq__header">
          <p className="faq__eyebrow">FAQ</p>
          <h2 id="faq-heading" className="faq__heading">
            Got questions?
          </h2>
          <p className="faq__subheading">
            A few answers before you get started.
          </p>
        </div>

        <div className="faq__list">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div className="faq__item" key={item.question}>
                <h3 className="faq__item-heading">
                  <button
                    type="button"
                    id={questionId}
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={questionId}
                  className={`faq__panel${isOpen ? " faq__panel--open" : ""}`}
                >
                  <div
                    className="faq__panel-inner"
                    ref={(el) => (panelRefs.current[index] = el)}
                  >
                    <p className="faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
