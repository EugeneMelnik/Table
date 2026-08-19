import styles from './InputFile.module.scss';
import downloadIconUrl from '../../../assets/icons/download.svg';
import { useRef } from 'react';

export const InputFile = ({
  title,
  name,
  accept,
  onChange,
  previewUrl,
  required = false,
  onRemove,
}) => {
  const inputRef = useRef(null);

  const handleRemove = () => {
    inputRef.current.value = '';
    onRemove();
  };

  return (
    <div className={`${styles.wrapper} ${previewUrl ? styles.ready : ''}`}>
      <div className={styles.inputFile}>
        <label>
          <span className={styles.icon}>
            <img src={downloadIconUrl} alt="downloaded" />
          </span>
          <input
            ref={inputRef}
            accept={accept}
            type="file"
            name={name}
            onChange={onChange}
            required={required}
          />
          <span className={styles.title}>{title}</span>
          <span className={styles.title_ready}>{previewUrl ? 'File is ready' : 'Add file'}</span>
        </label>
      </div>
      {previewUrl && (
        <div className={styles.previewWrapper}>
          <img className={styles.preview} src={previewUrl} alt="Selected preview" />
          <button
            className={styles.removePreview}
            type="button"
            onClick={handleRemove}
            aria-label="Remove selected image"
            title="Remove image"
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
};
