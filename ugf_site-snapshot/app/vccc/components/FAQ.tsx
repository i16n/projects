'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Do I have to attend every workshop?",
      answer: "The best way to learn and gain a competitive edge in the competition is to attend each event in-person. If you cannot attend a workshop, you can watch a recording of the workshop on this website. For obvious reasons, the top 5 teams are required to attend the pitch competition."
    },
    {
      question: "Do I need prior venture capital experience?",
      answer: "No, you do not need prior venture capital or finance experience to compete. However, you should be willing to learn and be open to new ideas."
    },
    {
      question: "How many people can be on a team?",
      answer: "Teams compete in groups of 2-4. If you don't have a team yet, you should still sign up and we will help you find a team"
    },
    {
      question: "How does the mentor program work?",
      answer: "Teams that advance on to the final stages of the competition are paired with a local investor to help them improve their due diligence and prepare for their final pitch."
    },
    {
      question: "Who is eligible to compete?",
      answer: "Any full-time undergraduate or graduate student enrolled at a higher education institution in any degree is eligible to participate. Team members do not need to attend the same university."
    },
    {
      question: "What makes this competition unique?",
      answer: "Rather than send out a case study like many other competitions, we are teaching you to think and act like real venture capitalists. This means learning how to source your own deals, perform due diligence, and convince your investment committee to support your investment. Progression throughout the competition is determined by the quality of the three deliverables: sourced deals, investment memo, and investment pitch."
    },
    {
      question: "Where are the events held?",
      answer: "Each event will be held at local universities across the state, broadcasted over Zoom, recorded, and posted to this website. Instructions for each event will be sent to registered teams via email."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-white text-left pr-4">{item.question}</h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ 
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-white text-md leading-relaxed mt-4">{item.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 