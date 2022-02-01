import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './simple-navbar.scoped.css';
import NavbarList from '../navbar-list/navbar-list';
import NavbarItem from '../navbar-item/navbar-item';
import Icon from '@common/icon';
import Modal from '@common/modal/modal';
import { useStore } from '@store';
import axios from "axios";


const downloadFromDocument = async (asynchronousDocument) => {
    const awaitedDocument = await asynchronousDocument;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(
        new Blob([ awaitedDocument.getData()], { type: "application/pdf" })
    );
    link.download = awaitedDocument.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
        window.URL.revokeObjectURL(link);
    }, 200);
}

const SimpleNavbar = () => {
    const modal = useRef(null);

    const {
        createMergedDocument,
        getMergedDocument,
        getAvailablePages,
        documents,
        deletedPages,
        t,
        //resetAll,
    } = useStore();

    const onClick = () => {
        console.log("documents", documents);
        if (documents.length === 0) {
            modal.current.open()
            return;
        }
        createMergedDocument();
        const mergedDocument = getMergedDocument();
        downloadFromDocument(mergedDocument);
        //resetAll();
    }

    return (
        <React.Fragment>
            <div className="navbar-simple">
                <NavbarList>
                    <NavbarItem
                        path={"/upload"}
                        label={t("add-button-label")}
                        Icon={Icon.Add}
                        count={documents.length}
                    />
                    <NavbarItem
                        path={"/bin"}
                        label={t("bin-button-label")}
                        Icon={Icon.Bin}
                        count={deletedPages.length}
                    />
                    <NavbarItem
                        path={"/settings"}
                        label={t("settings-button-label")}
                        Icon={Icon.Settings}
                    />
                    <NavbarItem
                        path={"/"}
                        label={t("download-button-label")}
                        Icon={Icon.Download}
                        onClick={onClick}
                    />

                </NavbarList>
            </div>
            <Modal
                defaultOpened={false}
                allowHandleEscape={false}
                title={""}
                fade={false}
                ref={modal}
            >
                {"You need to upload document first"}
            </Modal>
        </React.Fragment>
    )
}

export default SimpleNavbar;

SimpleNavbar.propTypes = {
}