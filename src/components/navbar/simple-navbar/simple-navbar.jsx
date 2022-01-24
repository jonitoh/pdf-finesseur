import React from 'react';
import PropTypes from 'prop-types';
import './simple-navbar.css';
import NavbarList from '../navbar-list/navbar-list';
import NavbarItem from '../navbar-item/navbar-item';
import Icon from '../../icon';
import { useStore } from '../../../store';
import axios from "axios";


//  simple fake download
const downloadFile = () => {
    console.log("start download");
    // it should be mergedDocument.path;
    const _path = "public/uploads/__8497_name_key_0.pdf";
    const name = "result.pdf";
    //send request
    axios({
        url: `${"http://localhost:5000"}/${_path}`,
        method: "GET",
        headers: {
            'Content-Type': 'application/pdf',
            //authorization: process.env.SERVER_TOKEN || "token"
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
            /*console.log("resùùùù", res)
            if (res.status === 200) {
                console.log("everything is ok")
            } else {
                console.log("oups something went wrong")
            }*/
        })
        // catch errors
        .catch(error => {
            console.log(error);
        })
}



const SimpleNavbar = () => {
    const {
        getNumberOfDocuments,
        getNumberOfDeletedPages,
        createMergedDocument,
        getMergedDocument,
        getAvailablePages,
        t,
        //resetAll,
    } = useStore();

    //clicktodownload
    const onClick = () => {
        console.log('CLICK---create the merged document');
        createMergedDocument();
        const output = getMergedDocument();
        const order = (
            getAvailablePages()
                .map(page => page.id)
        );
        console.log('CLICK---here is the merged document', output);
        console.log('CLICK---order', order);
        console.log('it should download!');
        //resetAll()
        downloadFile();
    }


    return (
        <div className="navbar-simple">
            <NavbarList>
                <NavbarItem
                    path={"/add"}
                    label={t("add-button-label")}
                    Icon={Icon.Add}
                    count={getNumberOfDocuments()}
                />
                <NavbarItem
                    path={"/bin"}
                    label={t("bin-button-label")}
                    Icon={Icon.Bin}
                    count={getNumberOfDeletedPages()}
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
    )
}

export default SimpleNavbar;

SimpleNavbar.propTypes = {
}