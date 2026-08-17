import type { Config } from 'tailwindcss';
import flowbite from 'flowbite-react/tailwind';

import {
  CARD_PADDING,
  ENTRY_LIST_PAPER_PADDING,
  LANDING_HEADER_HEIGHT,
  MIN_WIDTH_ENTRY_LIST_HEADER,
  SIDEBAR_WIDTH,
} from './src/shared/constants/layout';

/**
 * Semantic colours for the sidebar and cards, exposed as `aside-*` utilities
 * (`bg-aside-primary`, `text-aside-card-content`, …).
 */
const asideColors = {
  primary: '#0F172A',
  'header-primary': '#E7E3E0',
  text: '#FFFFFF',
  'button-active': '#E84256',
  'button-hover': '#1E293B',
  'button-text-hover': '#FFFFFF',
  card: '#334155',
  'card-content': '#FFFFFF',
  'card-border': '#7C7D91',
  divider: '#46475D',
  'card-link': '#E84154',
  'page-title': '#BCB1A9',
};

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/config/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontSize: {
        sm: '0.875rem',
        base: ['1rem', { lineHeight: '24px' }],
      },
      colors: {
        black: '#333333',
        bg_2: '#F3F3F3',
        grey_3: '#BABABA',
        danger: '#B3001B',
        warning: '#ECA72C',
        active: '#679436',
        inactive: '#B3001B',
        paper: {
          50: '#F4F2F1',
          200: '#D2CBC6',
          300: '#BCB1A9',
          400: '#A6978C',
          500: '#E7E3E0',
          700: '#564B43',
          800: '#39322D',
          950: '#0E0D0B',
        },
        raspberry: {
          500: '#CD1848',
          600: '#B71540',
          900: '#CD1849',
        },
        green: {
          500: '#479D0B',
        },
        aside: asideColors,
      },
      backgroundImage: {
        'custom-dashed-border': `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23D2CBC6FF' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='4' stroke-linecap='square'/%3e%3c/svg%3e")`,
      },
      height: {
        // The CommonsDB header sits 10px tighter than the base rhythm.
        landingHeaderHeight: `${LANDING_HEADER_HEIGHT - 10}px`,
      },
      padding: {
        entryListPaperPadding: `${ENTRY_LIST_PAPER_PADDING}px`,
        cardPadding: `${CARD_PADDING}px`,
        mainContentPadding: '1.13rem',
      },
      minWidth: {
        minWidthEntryList: `${MIN_WIDTH_ENTRY_LIST_HEADER + ENTRY_LIST_PAPER_PADDING * 2}px`,
      },
      width: {
        sidebarWidth: `${SIDEBAR_WIDTH}px`,
      },
      boxShadow: {
        tooltip: '0px 4px 20px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
