import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CategoryFAQ } from '@/data/faq';

interface FAQSectionProps {
  faq: CategoryFAQ;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faq }) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="px-3 py-1">
                {faq.items.length} Questions fréquentes
              </Badge>
            </div>
            <h2 className="font-merriweather text-3xl font-bold mb-4">
              {faq.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {faq.subtitle}
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faq.items.map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="border border-border rounded-lg px-6 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline">
                  <span className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1 text-xs font-medium">
                      {(index + 1).toString().padStart(2, '0')}
                    </Badge>
                    <span className="font-medium leading-relaxed">{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2 pl-12">
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="leading-relaxed">{item.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Vous avez d'autres questions ?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Notre équipe d'experts est là pour vous accompagner
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Badge variant="secondary" className="px-4 py-2">
                  📧 support@mytechgear.fr
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  📞 01 23 45 67 89
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  💬 Chat en direct 9h-18h
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};