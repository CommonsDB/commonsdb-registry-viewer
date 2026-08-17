import { type FC, type ReactNode, type SVGProps } from 'react';
import clsx from 'clsx';
import { Tag } from '../atoms';

export interface TimelineItem {
  /** Stable identity for list rendering; falls back to the index. */
  id?: string;
  title?: string;
  time?: string | Date;
  content?: string | ReactNode;
  icon?: FC<SVGProps<SVGSVGElement>>;
  pointColor?: string | 'success' | 'warning' | 'failure' | 'gray';
  tag?: string;
  tagColor?: string | 'success' | 'warning' | 'failure' | 'gray';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const getPointColorClasses = (color?: string) => {
  switch (color) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'failure':
      return 'bg-red-500';
    case 'gray':
      return 'bg-gray-200';
    case 'black':
      return 'bg-paper-950';
    default:
      return 'bg-gray-200';
  }
};

export const Timeline: FC<TimelineProps> = ({ items, className }) => {
  return (
    <ol className={clsx('relative', className)}>
      {items.map((item, index) => (
        <li
          key={item.id ?? index}
          className={`${index === items.length - 1 ? '' : 'border-s border-gray-200 pb-4'} pl-10 pr-4`}
        >
          <span
            className={clsx(
              'absolute -start-2 flex size-4 items-center justify-center rounded-full ring-4 ring-white',
              getPointColorClasses(item.pointColor),
            )}
          >
            {item.icon && <item.icon className="size-2 text-white" />}
          </span>
          <div className="">
            <div className="mb-2 flex items-center gap-2">
              {item.time && (
                <time className="text-md font-semibold text-paper-950">
                  {item.time instanceof Date ? item.time.toLocaleString() : item.time}
                </time>
              )}
              {item.tag && (
                <Tag
                  className={`mr-0 ${item.tagColor === 'success' ? 'bg-active/10 text-active' : 'bg-inactive/10 text-inactive'}`}
                >
                  {item.tag}
                </Tag>
              )}
            </div>
            {item.title && (
              <h3 className="mb-2 text-lg font-semibold text-paper-950">{item.title}</h3>
            )}
            {item.content && (
              <div className="text-base font-normal text-paper-700">{item.content}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
