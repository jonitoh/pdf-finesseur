import React, { useRef, useState } from 'react';
import Icon from '#common/icon';
import Modal, { Ref as ModalRef } from '#common/modal/modal';
import select, { Store as State } from '#store';
import { Doc } from '#services/page-and-document';
import styles from './simple-navbar.module.css';
import NavbarItem from '../item/item';
import NavbarList from '../list/list';

const selector = (state: State) => ({
  createMergedDocument: state.createMergedDocument,
  getMergedDocument: state.getMergedDocument,
  documents: state.documents,
  deletedPages: state.deletedPages,
  t: state.t,
  resetAll: state.resetAll,
});

function downloadFromDocument(doc: Doc) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(new Blob([doc.getData()], { type: 'application/pdf' }));
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  setTimeout(function removeLink() {
    window.URL.revokeObjectURL(link.href);
  }, 200);
}

export default function SimpleNavbar() {
  const [hasBug, setHasBug] = useState(false);
  const modal = useRef<ModalRef>(null);

  const { createMergedDocument, getMergedDocument, documents, deletedPages, t, resetAll } =
    select(selector);

  function onClick() {
    console.info('documents', documents);
    if (documents.length === 0) {
      modal.current?.open();
      return;
    }
    createMergedDocument(true);
    const mergedDocument = getMergedDocument();
    if (!mergedDocument) {
      setHasBug(true);
      modal.current?.open();
      return;
    }
    downloadFromDocument(mergedDocument);
    // resetAll();
  }

  return (
    <>
      <div className={styles.navbarSimple}>
        <NavbarList>
          <NavbarItem
            link="/upload"
            text={t('add-button-label', 'soft') as string}
            Icon={Icon.Add}
            count={documents.length}
          />
          <NavbarItem
            link="/bin"
            text={t('bin-button-label', 'soft') as string}
            Icon={Icon.Bin}
            count={deletedPages.length}
          />
          <NavbarItem
            link="/settings"
            text={t('settings-button-label', 'soft') as string}
            Icon={Icon.Settings}
          />
          <NavbarItem
            link="/"
            text={t('download-button-label', 'soft') as string}
            Icon={Icon.Download}
            onClick={onClick}
          />
        </NavbarList>
      </div>
      <Modal
        isOpenedAtDefault={false}
        shouldHandleEscape={false}
        title=""
        isFading={false}
        ref={modal}
      >
        {hasBug
          ? 'Something unexpected happened during the mering process'
          : 'You need to upload document first'}
      </Modal>
    </>
  );
}
