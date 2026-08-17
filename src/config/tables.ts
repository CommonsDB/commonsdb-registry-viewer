/**
 * Column and detail-panel layout for the declarations tables.
 *
 * `label` values are translation keys; `key` values must match a field produced
 * by `mapDeclarationToRow`.
 */

/** How a cell's value should be rendered. */
export type ColumnType = 'text' | 'image' | 'imageWithLink' | 'tag' | 'buttonWithModal';

export interface TableColumn {
  label: string;
  key: string;
  type?: ColumnType;
  sortable?: boolean;
  position?: 'left' | 'right' | 'center';
  className?: string;
}

export interface TableDropdownOption {
  label: string;
  key: string;
  /** Render the value as a link, using the row's `<key>Link` field when present. */
  isLink?: boolean;
  /** Show a copy-to-clipboard affordance next to the value. */
  hasCopyOption?: boolean;
  /** Span the full width of the detail panel instead of one column. */
  isFullWidth?: boolean;
  /** Lay out in the three-column group at the foot of the panel. */
  isThreeCol?: boolean;
  /** Render with the public-domain rationale tooltip. */
  isPdRationale?: boolean;
}

const declarerLogoColumn: TableColumn = {
  label: 'column.declarerLogo',
  key: 'declarerLogo',
  type: 'image',
  position: 'center',
  className: 'w-fit',
};

const sharedColumns: TableColumn[] = [
  {
    label: 'column.declarer',
    key: 'declarer',
    position: 'center',
    className: 'min-w-[240px] whitespace-nowrap',
  },
  {
    label: 'column.declarationDate',
    key: 'declarationDate',
    sortable: true,
    position: 'left',
    className: 'w-fit min-w-[230px] pl-4',
  },
  {
    label: '',
    key: 'previousDeclarations',
    type: 'buttonWithModal',
    sortable: false,
    position: 'center',
    className: 'w-full min-w-[230px]',
  },
];

const locationColumn: TableColumn = {
  label: 'column.location',
  key: 'location',
  position: 'center',
  className: 'w-fit',
};

/** Columns for the search results table on the explorer page. */
export const searchTableColumns: readonly TableColumn[] = [
  declarerLogoColumn,
  ...sharedColumns,
  {
    label: 'column.rightsStatement',
    key: 'rightsStatementTag',
    type: 'tag',
    position: 'center',
    className: 'w-fit ml-auto',
  },
  locationColumn,
];

/**
 * Columns for the random declarations table.
 *
 * Differs from the search table in two ways: the preview image links through to
 * the declaration, and the rights statement reserves more width because results
 * are unfiltered and so span more licence types.
 */
export const randomDeclarationsTableColumns: readonly TableColumn[] = [
  { ...declarerLogoColumn, type: 'imageWithLink' },
  ...sharedColumns,
  {
    label: 'column.rightsStatement',
    key: 'rightsStatementTag',
    type: 'tag',
    position: 'center',
    className: 'w-fit ml-auto min-w-[200px]',
  },
  locationColumn,
];

const sharedDropdownOptions: TableDropdownOption[] = [
  { label: 'tableDropdown.location', key: 'location', isLink: true, isFullWidth: true },
  { label: 'tableDropdown.iscc', key: 'iscc', hasCopyOption: true, isFullWidth: true },
  { label: 'tableDropdown.declarerId', key: 'declarerId', hasCopyOption: true },
  { label: 'tableDropdown.rightsStatement', key: 'rightsStatement', isLink: true },
  {
    label: 'tableDropdown.declarationId',
    key: 'declarationId',
    hasCopyOption: true,
    isLink: true,
  },
  { label: 'tableDropdown.signature', key: 'signature', isLink: true },
  { label: 'tableDropdown.declarationDate', key: 'declarationDate', isThreeCol: true },
];

const pdRationaleOption: TableDropdownOption = {
  label: 'tableDropdown.pdRationale',
  key: 'pdRationale',
  isThreeCol: true,
  isPdRationale: true,
};

/** Expanded-row detail fields for the search results table. */
export const searchTableDropdownOptions: readonly TableDropdownOption[] = [
  ...sharedDropdownOptions,
  // Only search results carry a relevance score against the queried ISCC.
  { label: 'tableDropdown.distance', key: 'distance', isThreeCol: true },
  pdRationaleOption,
];

/** Expanded-row detail fields for the random declarations table. */
export const randomDeclarationsDropdownOptions: readonly TableDropdownOption[] = [
  ...sharedDropdownOptions,
  pdRationaleOption,
];
