import type { FC, ReactNode } from 'react';

import { CardContent, EntryListPaper, SectionTitle } from '../atoms';

interface ISectionProps {
  title?: string;
  content?: string | ReactNode;
  image?: ReactNode;
  sectionClassName?: string;
}

export const Section: FC<ISectionProps> = ({ title, content, image, sectionClassName }) => (
  <EntryListPaper className={sectionClassName || '!bg-paper-50'}>
    <div className="flex flex-row gap-16">
      <div className="mr-4 flex flex-col gap-4">
        {title && <SectionTitle>{title}</SectionTitle>}
        {content && <CardContent>{content}</CardContent>}
      </div>
      <div className="relative w-full">{image}</div>
    </div>
  </EntryListPaper>
);
