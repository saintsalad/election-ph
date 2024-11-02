import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  isCompleted: boolean;
}

const featureData: FeatureItem[] = [
  // Survey Result Context
  {
    title: "Survey Analytics",
    description: "Sample size, margin of error, and confidence levels",
    isCompleted: false,
  },
  {
    title: "Methodology Display",
    description: "Transparent data collection methods and period",
    isCompleted: false,
  },

  // Non-Official Status
  {
    title: "Disclaimer System",
    description: "Clear non-official status indicators and notices",
    isCompleted: false,
  },

  // Privacy Features
  {
    title: "Data Privacy",
    description: "Anonymization and consent management",
    isCompleted: false,
  },
  {
    title: "User Data Control",
    description: "Data export and deletion options",
    isCompleted: false,
  },

  // Content Moderation
  {
    title: "Content Guidelines",
    description: "Moderation system and reporting tools",
    isCompleted: false,
  },

  // Result Transparency
  {
    title: "Result Context",
    description: "Demographics and methodology explanations",
    isCompleted: false,
  },

  // Documentation
  {
    title: "Legal Documents",
    description: "Privacy policy and terms of service",
    isCompleted: false,
  },

  // Technical Safeguards
  {
    title: "Security Measures",
    description: "Rate limiting and anti-spam protection",
    isCompleted: false,
  },

  // UI Improvements
  {
    title: "Context Helpers",
    description: "Tooltips and warning systems",
    isCompleted: false,
  },

  // Receipt System
  {
    title: "Digital Receipts",
    description: "Verifiable non-official survey records",
    isCompleted: false,
  },

  // Accessibility
  {
    title: "Multi-language",
    description: "Filipino and English language support",
    isCompleted: false,
  },
  {
    title: "Accessibility",
    description: "Screen reader and readability features",
    isCompleted: false,
  },
];

export default function RoadmapPage() {
  return (
    <div className='container mx-auto px-4 pt-24 max-w-6xl'>
      <div className='space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight lg:text-4xl'>
            Feature Roadmap
          </h1>
          <p className='text-muted-foreground'>
            Track the development of Election PH features
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {featureData.map((feature, index) => (
            <Card
              key={index}
              className={`transition-all hover:scale-105 ${
                feature.isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
              <CardContent className='p-4 space-y-2'>
                <div className='flex items-start justify-between gap-2'>
                  <h3 className='font-medium text-sm'>{feature.title}</h3>
                  <CheckCircle2
                    className={`h-4 w-4 flex-shrink-0 ${
                      feature.isCompleted ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
