import { type CustomFlowbiteTheme } from 'flowbite-react';

// each field will replace the corresponding line in the generated flowbite.theme.ts file
// if you want to override only one class, copy the whole line from the default theme and change only the part you want to override
export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    base: 'leading-[22px] group relative flex items-stretch justify-center text-center transition-[background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none',
    color: {
      // primary filled button
      info: 'py-[15px] px-[32px] border border-raspberry-900 bg-raspberry-900 text-white hover:bg-raspberry-600',
      // red is used as nav item in Sidebar component
      red: ' text-black hover:bg-paper-50 justify-start py-4',
      // teal is TextButton
      teal: 'py-[17px] px-[32px] hover:bg-paper-500',
    },
    spinnerSlot: 'absolute top-0 flex h-full items-center [&_span_svg]:fill-raspberry-900',
    size: {
      md: 'font-semibold text-center',
    },
    inner: {
      isProcessingPadding: {
        md: 'pl-4',
      },
    },
    outline: {
      color: {
        default: 'border-paper-950 bg-transparent hover:bg-paper-500 hover:border-paper-700',
      },
      on: 'bg-transparent text-paper-950 !border-0',
    },
  },
  tooltip: {
    hidden: 'hidden opacity-0',
    arrow: {
      base: 'hidden absolute z-10 h-2 w-2 rotate-45',
    },
    base: 'absolute z-10 inline-block rounded px-2 py-1 text-[10px] leading-[14px] font-medium',
    style: {
      dark: 'shadow-tooltip bg-white text-gray-900',
      auto: 'shadow-tooltip bg-white text-gray-900',
    },
  },
  modal: {
    root: {
      show: {
        on: 'flex bg-grey_3 bg-opacity-40',
        off: 'hidden',
      },
    },
    content: {
      base: 'relative h-full w-full p-4 md:h-auto pointer-events-auto ring-transparent focus:outline-none',
      inner: 'relative flex max-h-[90dvh] flex-col rounded-2xl bg-white shadow dark:bg-gray-700',
    },
    body: {
      base: 'flex-1 overflow-auto px-[30px] pb-[30px] pt-0 text-black',
    },
    header: {
      base: 'flex items-start justify-between rounded-t px-[30px] pt-[30px] pb-6 ',
      title: 'text-xl font-semibold text-black',
      close: {
        base: 'ml-auto inline-flex items-center rounded-full [&_svg]:size-[24px] bg-transparent p-1 text-paper-950 hover:bg-bg_2',
        icon: 'h-5 w-5',
      },
    },
  },
  textInput: {
    field: {
      input: {
        base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 focus:ring-transparent ring-offset-0 focus:ring-offset-0',
        sizes: {
          md: 'p-[7px] text-xs',
        },
        colors: {
          gray: 'border-gray-300 bg-white focus:border-black',
          failure: 'border-danger focus:border-black',
        },
        withAddon: {
          on: 'rounded-r',
          off: 'rounded',
        },
      },
    },
  },
  toast: {
    root: {
      base: 'flex w-full max-w-xs items-center rounded-lg bg-paper-800 px-4 py-[20px] text-white shadow',
    },
    toggle: {
      base: '-m-1.5 ml-4 inline-flex h-8 w-8 rounded-lg bg-transparent p-1.5 text-white',
    },
  },
};
