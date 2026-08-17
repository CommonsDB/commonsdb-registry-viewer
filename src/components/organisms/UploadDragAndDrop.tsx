'use client';
import React, {
  type ChangeEvent,
  type DragEvent,
  type FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { TextInput } from 'flowbite-react';
import { MdClose, MdFileUpload, MdSearch } from 'react-icons/md';
import { DotLottiePlayer } from '@dotlottie/react-player';

import { useTranslation } from '~/shared/utils/i18n/client';
import { useParams } from 'next/navigation';

interface IUploadDragAndDropProps {
  onFileChange: (files: FileList) => void;
  loading: boolean;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

export const UploadDragAndDrop: FC<IUploadDragAndDropProps> = (props) => {
  const { onFileChange, loading, onSearch, onClearSearch } = props;
  const params = useParams();
  const { t } = useTranslation();

  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const labelRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Ignore leave events fired when the cursor moves over a child element.
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
      onFileChange?.(event.dataTransfer.files);
      setSearchQuery('');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
      onFileChange?.(event.target.files);
      setSearchQuery('');
    }
    // Reset so choosing the same file again still fires a change event.
    event.target.value = '';
  };

  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSearchQuery('');
    onClearSearch();
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Navigation happens on Enter or the explicit clear button — not while the
    // user is still editing the query.
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (labelRef.current && !containerHeight) {
      setContainerHeight(labelRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const iscc = params?.iscc;
    if (iscc) {
      setSearchQuery(iscc as string);
    }
  }, [params]);

  return (
    <div
      ref={labelRef}
      className="relative flex w-full flex-col items-center justify-center rounded-[16px] border border-paper-200 bg-white px-4 pb-6 pt-[17px]"
    >
      {imagePreview ? (
        <div className="relative flex size-full items-center justify-center rounded-[16px] bg-paper-50 p-2">
          <button
            onClick={clearImage}
            className="absolute right-3 top-3 ml-2 text-grey_3 hover:text-paper-700"
            aria-label={t('upload.clearImage')}
          >
            <MdClose size={24} />
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-[16px] object-contain"
            style={{ maxHeight: containerHeight ? `${containerHeight - 60}px` : '200px' }} // subtract top padding
          />
        </div>
      ) : (
        <>
          <div className="relative w-full pb-4">
            <TextInput
              id="search-input"
              placeholder={t('placeholder.search')}
              className="w-full"
              sizing="lg"
              icon={MdSearch}
              rightIcon={() =>
                searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      onClearSearch();
                    }}
                    className="pointer-events-auto z-10 text-grey_3 hover:text-paper-700"
                    aria-label={t('upload.clearSearch')}
                  >
                    <MdClose size={24} />
                  </button>
                )
              }
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
            />
          </div>
          <label
            htmlFor="dropzone-file"
            className={clsx(
              'flex w-full cursor-pointer flex-col items-center justify-center rounded-lg',
              'relative bg-custom-dashed-border hover:bg-paper-50',
              dragging && 'bg-paper-50',
              loading && 'pointer-events-none bg-paper-50',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <DotLottiePlayer
              src="/spinner.lottie"
              autoplay
              loop
              className={clsx(
                'absolute left-1/2 top-1/2 ml-[-50px] mt-[-50px] size-[100px]',
                loading ? 'visible' : 'invisible',
              )}
            />
            <div
              className={clsx(
                'flex h-full flex-col items-center justify-between py-7',
                loading && 'invisible',
              )}
            >
              <MdFileUpload className="fill-paper-500" size={64} />
              <p>
                <span className="text-raspberry-500 hover:text-raspberry-600 hover:underline">
                  {t('btn.clickToUpload')}
                </span>
                <span className="text-paper-300"> {t('orDragAndDrop')}</span>
              </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </>
      )}
    </div>
  );
};
