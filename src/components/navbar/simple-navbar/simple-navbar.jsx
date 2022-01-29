import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './simple-navbar.scoped.css';
import NavbarList from '../navbar-list/navbar-list';
import NavbarItem from '../navbar-item/navbar-item';
import Icon from '@common/icon';
import Modal from '@common/modal/modal';
import { useStore } from '@store';
import axios from "axios";


const downloadFile = (mergedDocument) => {
    console.log("start download");
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(
        new Blob([mergedDocument.getData()], { type: "application/pdf" })
    );
    link.download = mergedDocument.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
        window.URL.revokeObjectURL(link);
    }, 200);
}

const fakeDownloadFile = () => {
    console.log("start download");
    const path = "public/uploads/test_one_page_for_download.pdf";
    const name = "result.pdf";

    //send request
    axios({
        url: `${"http://localhost:5000"}/${path}`,
        method: "GET",
        headers: {
            'Content-Type': 'application/pdf',
        },
    })
        // handle response
        .then(response => {
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );
            link.download = name;
            document.body.appendChild(link);
            link.click();
            setTimeout(function () {
                window.URL.revokeObjectURL(link);
            }, 200);
        })
        // catch errors
        .catch(error => {
            console.log(error);
        })
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
        if (documents.length === 0) {
            modal.current.open()
            return;
        }
        console.log('CLICK---create the merged document');
        createMergedDocument();
        const mergedDocument = getMergedDocument();
        console.log('it should download!');
        downloadFile(mergedDocument);
        //resetAll();
    }

    const fakeOnClick = () => {
        if (documents.length === 0) {
            modal.current.open()
            return;
        }
        console.log('CLICK---create the merged document');
        createMergedDocument();
        const mergedDocument = getMergedDocument();
        const order = (
            getAvailablePages()
                .map(page => page.id)
        );
        console.log('CLICK---here is the merged document', mergedDocument);
        console.log('CLICK---order', order);
        console.log('it should download!');
        fakeDownloadFile();
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
                        onClick={fakeOnClick}
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