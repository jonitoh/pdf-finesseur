import React, { useState, useRef } from 'react';
import Button from '#common/buttons/button';
import { useTranslation } from 'react-i18next';
import Modal, { Ref as ModalRef } from '#common/alert/alert';
import { purgeStorage } from '#services/api';

export default function PurgeButton() {
  const { t } = useTranslation();
  const modalRef = useRef<ModalRef>(null);
  const [modalMsg, setModalMsg] = useState('');

  async function onClick() {
    const result = await purgeStorage();
    console.log('our result', result);
    if (!result) {
      setModalMsg('Something unexpected happened!!');
    } else if (result.success) {
      setModalMsg('Purge done');
    } else {
      setModalMsg(`Bug with purge: ${result.name}:${result.message}`);
    }
    modalRef.current?.open();
  }

  return (
    <>
      <Modal ref={modalRef}>{modalMsg}</Modal>
      <Button type="button" label={t('purge')} onClick={onClick} variant="plain" />
    </>
  );
}
