import React, { useRef, useState } from 'react';
import Icon from '#common/icon';
import Modal, { Ref as ModalRef } from '#common/alert/alert';
import select, { Store as State } from '#store';
import { useTranslation } from 'react-i18next';
import { Doc } from '#services/page-and-document';
import styles from './simple-navbar.module.css';
import NavbarItem from '../item/item';
import NavbarList from '../list/list';

const selector = (state: State) => ({
  createMergedDocument: state.createMergedDocument,
  getMergedDocument: state.getMergedDocument,
  documents: state.documents,
  deletedPages: state.deletedPages,
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

  const { createMergedDocument, getMergedDocument, documents, deletedPages, resetAll } =
    select(selector);

  const { t } = useTranslation();

  async function onClick() {
    if (documents.length === 0) {
      modal.current?.open();
      return;
    }
    await createMergedDocument(true);
    const mergedDocument = getMergedDocument();
    if (!mergedDocument) {
      setHasBug(true);
      modal.current?.open();
    } else {
      downloadFromDocument(mergedDocument);
    }
    // resetAll();
  }

  return (
    <>
      <div className={styles.navbarSimple}>
        <NavbarList>
          <NavbarItem
            link="/upload"
            text={t('navigation.main.add')}
            Icon={Icon.Add}
            count={documents.length}
          />
          <NavbarItem
            link="/bin"
            text={t('navigation.main.bin')}
            Icon={Icon.Bin}
            count={deletedPages.length}
          />
          <NavbarItem link="/settings" text={t('navigation.main.settings')} Icon={Icon.Settings} />
          <NavbarItem
            link="/"
            text={t('navigation.main.download')}
            Icon={Icon.Download}
            onClick={onClick}
          />
          <NavbarItem link="/test" text="TEST ICI" Icon={Icon.Warning} />
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
          ? t('home.process.withBug', { ns: 'page' })
          : t('home.process.emptyItems', { ns: 'page' })}
      </Modal>
    </>
  );
}
