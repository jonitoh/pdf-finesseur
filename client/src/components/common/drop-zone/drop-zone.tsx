import React, { useState, createRef, ReactNode, DragEvent, ChangeEvent } from 'react';
import Icon from '#common/icon';
import classNames from 'classnames';
import styles from './drop-zone.module.css';

export type Props = {
  onFilesAdded(files: FileList): Promise<void>;
  isDisabled?: boolean;
  title?: string | ReactNode;
};

export default function DropZone({ onFilesAdded, isDisabled, title }: Props) {
  const inputRef = createRef<HTMLInputElement>();
  const [highlight, setHighlight] = useState(false);

  const cursorStyle = { cursor: isDisabled ? 'default' : 'pointer' };

  function openFileDialog() {
    if (isDisabled) {
      return;
    }
    inputRef.current?.click();
  }

  async function addFiles(event: ChangeEvent<HTMLInputElement>) {
    if (isDisabled) return;
    const { files } = event.target;
    if (onFilesAdded && files) {
      await onFilesAdded(files);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (isDisabled) return;
    setHighlight(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setHighlight(false);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (isDisabled) return;
    const { files } = event.dataTransfer;
    if (onFilesAdded) {
      await onFilesAdded(files);
    }
    setHighlight(false);
  }

  return (
    <div
      className={styles.dropzone}
      role="none"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      onKeyPress={openFileDialog}
      style={cursorStyle}
    >
      <Icon.CloudUpload
        className={classNames([styles.icon, highlight ? styles.highlight : false])}
        style={cursorStyle}
      />
      <input ref={inputRef} className={styles.input} type="file" multiple onChange={addFiles} />
      {typeof title === 'string' ? <h3 className={styles.h3}>{title}</h3> : { title }}
    </div>
  );
}

DropZone.defaultProps = {
  isDisabled: false,
  title: undefined,
};
