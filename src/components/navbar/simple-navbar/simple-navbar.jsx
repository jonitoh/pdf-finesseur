import React from 'react';
import PropTypes from 'prop-types';
import './simple-navbar.css';
import NavbarList from '../navbar-list/navbar-list';
import NavbarItem from '../navbar-item/navbar-item';
import { useStore } from '../../../store';

const SimpleNavbar = () => {
    const {
        getNumberOfDocuments,
        getNumberOfDeletedPages,
        createMergedDocument,
        getMergedDocument,
        getAvailablePages,
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
    }


    return (
        <div className="navbar-simple">
            <NavbarList>
                <NavbarItem
                    path={"/add"}
                    label={"Ajout fichier"}
                    icon={"./assets/icons/add-file.svg"}
                    count={getNumberOfDocuments()}
                />
                <NavbarItem
                    path={"/bin"}
                    label={"poubelle"}
                    icon={"./assets/icons/trash-bin.svg"}
                    count={getNumberOfDeletedPages()}
                />
                <NavbarItem
                    path={"/settings"}
                    label={"paramètres"}
                    icon={"./assets/icons/settings.svg"}
                    count={0}
                />
                <NavbarItem
                    path={"/"}
                    label={"télécharger"}
                    icon={"./assets/icons/download.svg"}
                    count={0}
                    onClick={onClick}
                />

            </NavbarList>
        </div>
    )
}

export default SimpleNavbar;

SimpleNavbar.propTypes = {
}