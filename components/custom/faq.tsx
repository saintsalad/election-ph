import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants/data";

interface FAQProps {
  showItems?: number;
}

const FAQ = ({ showItems }: FAQProps) => {
  const [showAll, setShowAll] = useState(!showItems);
  const displayedFaqs = showAll
    ? faqData.faqs
    : faqData.faqs.slice(0, showItems);

  return (
    <div className='w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <h2 className='text-4xl font-bold text-center mb-8'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>
          Frequently Asked Questions
        </span>
      </h2>
      <Accordion
        type='single'
        collapsible
        className='mt-8 space-y-4'
        defaultValue='item-0'>
        {displayedFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className='text-base font-medium'>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!showAll && showItems && (
        <div className='mt-8 text-center'>
          <Link href='/faq' className='text-blue-600 hover:text-blue-800'>
            View all FAQs
          </Link>
        </div>
      )}
    </div>
  );
};

export default FAQ;
