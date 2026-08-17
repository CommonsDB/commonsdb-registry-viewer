import React, { type FC } from 'react';

import { ROUTES } from '~/shared/constants';
import { useTranslation } from '~/shared/utils/i18n/client';

import { ContentDisplay } from '../atoms';
import { Divider } from '../atoms/Divider';
import { BaseModal } from '../molecules/BaseModal';

interface IConflictDeclaration {
  cidV1: string;
  declarer: string;
  rightsStatement: string;
  timestamp: string;
}

interface DeclarationConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  declaration: IConflictDeclaration;
  declarationsWithConflicts: IConflictDeclaration[];
}

const DeclarationContent: FC<{ declaration: IConflictDeclaration; showDivider?: boolean }> = ({
  declaration,
  showDivider = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className="my-2">
      {showDivider && <Divider className="mb-2 border-gray-200" />}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-paper-400">{t('conflict.cid')}:</span>
        <ContentDisplay
          content={declaration.cidV1}
          hasCopyOption={true}
          isLink={true}
          linkUrl={`${ROUTES.EXPLORER}/${encodeURIComponent(declaration.cidV1)}`}
        />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-paper-400">{t('column.declarer')}:</span>
        <ContentDisplay content={declaration.declarer} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-paper-400">{t('column.rightsStatement')}:</span>
        <ContentDisplay content={declaration.rightsStatement} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-paper-400">{t('conflict.timestamp')}:</span>
        <ContentDisplay content={declaration.timestamp} />
      </div>
    </div>
  );
};

/** Details of a declaration whose rights statement disagrees with others for the same work. */
export const DeclarationConflictModal: FC<DeclarationConflictModalProps> = ({
  isOpen,
  onClose,
  declaration = {} as IConflictDeclaration,
  declarationsWithConflicts = [],
}) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      show={isOpen}
      onClose={onClose}
      showCancelButton={true}
      showOkButton={true}
      onOk={onClose}
      title={t('conflict.title')}
      size="2xl"
    >
      <div className="flex w-full items-center justify-center">
        {!Object.keys(declaration).length ? (
          <div className="size-6 animate-spin rounded-full border-b-2 border-raspberry-500" />
        ) : (
          <div className="flex w-full flex-col gap-3">
            <p>{t('conflict.description')}</p>
            <p>{t('conflict.declaration')}:</p>
            <DeclarationContent declaration={declaration} showDivider={false} />
            {declarationsWithConflicts.length > 0 && (
              <>
                <p>{t('conflict.conflictingDeclarations')}:</p>
                <div className="flex flex-col gap-2">
                  {declarationsWithConflicts.map((conflicting, index) => (
                    <DeclarationContent
                      key={conflicting.cidV1}
                      declaration={conflicting}
                      showDivider={index !== 0}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
};
