import { type FC } from 'react';

import { type IPreviousDeclaration } from '../../api/types/declaration';
import { METADATA_PUBLIC_URL } from '~/config/env';
import { getUTCDate } from '~/shared/utils/jsHelpers';
import { useTranslation } from '~/shared/utils/i18n/client';

import { ContentDisplay } from '../atoms';
import { BaseModal } from '../molecules/BaseModal';
import { Timeline } from '../molecules';

interface PreviousDeclarationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  declarationId: string;
  declaration: IPreviousDeclaration;
  declarations?: IPreviousDeclaration[];
  isLoading?: boolean;
}

interface FieldChange {
  field: string;
  oldValue: string;
  newValue: string;
}

/** The fields that changed between a declaration and its predecessor. */
function diffDeclarations(
  declaration: IPreviousDeclaration,
  previous: IPreviousDeclaration | undefined,
  t: (key: string) => string,
): FieldChange[] {
  return [
    {
      field: t('tableDropdown.rightsStatement'),
      oldValue: previous?.rightsStatement ?? '',
      newValue: declaration?.rightsStatement ?? '',
    },
    {
      field: t('tableDropdown.location'),
      oldValue: previous?.location ?? '',
      newValue: declaration?.location ?? '',
    },
  ].filter((change) => previous && change.oldValue !== change.newValue);
}

const DeclarationContent: FC<{
  declaration: IPreviousDeclaration;
  previousDeclaration: IPreviousDeclaration | undefined;
}> = ({ declaration, previousDeclaration }) => {
  const { t } = useTranslation();
  const changes = diffDeclarations(declaration, previousDeclaration, t);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-paper-400">{t('tableDropdown.declarationId')}:</span>
        <ContentDisplay
          content={declaration.declarationId}
          hasCopyOption={true}
          isLink={true}
          linkUrl={`${METADATA_PUBLIC_URL}/${encodeURIComponent(declaration.declarationId)}`}
        />
      </div>
      {!!changes.length && (
        <table className="w-full rounded border border-paper-200 text-left text-sm text-gray-500">
          <thead className="bg-paper-50 text-gray-700">
            <tr>
              <th scope="col" className="w-1/5 px-3 py-2 font-semibold">
                {t('previousDeclarations.field')}
              </th>
              <th scope="col" className="w-2/5 px-3 py-2 font-semibold">
                {t('previousDeclarations.oldValue')}
              </th>
              <th scope="col" className="w-2/5 px-3 py-2 font-semibold">
                {t('previousDeclarations.newValue')}
              </th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.field} className="border-t border-paper-200 bg-white">
                <td className="px-3 py-2">{change.field}</td>
                <td className="break-all px-3 py-2">{change.oldValue}</td>
                <td className="break-all px-3 py-2">{change.newValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/** Timeline of a declaration's supersession history, newest first. */
export const PreviousDeclarationsModal: FC<PreviousDeclarationsModalProps> = ({
  isOpen,
  onClose,
  declaration = {} as IPreviousDeclaration,
  declarations = [],
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Item i's immediate predecessor: the head's is declarations[0]; for
  // declarations[i - 1] it is declarations[i].
  const timelineItems = [declaration, ...declarations].map((item, index) => ({
    id: `${item.cidV1 ?? ''}-${index}`,
    time: getUTCDate(item.timestamp),
    content: <DeclarationContent declaration={item} previousDeclaration={declarations[index]} />,
    ...(!index
      ? {
          pointColor: 'black',
          tag: t('previousDeclarations.latestVersion'),
          tagColor: 'success',
        }
      : {}),
  }));

  return (
    <BaseModal show={isOpen} onClose={onClose} title={t('previousDeclarations.title')} size="3xl">
      <div className="flex w-full items-center justify-center">
        {isLoading ? (
          <div>{t('previousDeclarations.loading')}</div>
        ) : !timelineItems.length ? (
          <div className="text-gray-500">{t('previousDeclarations.empty')}</div>
        ) : (
          <Timeline items={timelineItems} className="w-full" />
        )}
      </div>
    </BaseModal>
  );
};
