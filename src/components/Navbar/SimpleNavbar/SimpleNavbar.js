import React from 'react';
import PropTypes from 'prop-types';
import './SimpleNavbar.css';
import NavbarList from '../NavbarList/NavbarList';
import NavbarItem from '../NavbarItem/NavbarItem';

const SimpleNavbar = () => {
    // counts to be updated
    const count_add = 2;
    const count_bin = 10;
    const count_parametre = 0;
    const count_download = 990;

    //clicktodownload
    const onClick = () => {
        console.log('it should download!');
    }


    return (
        <div className="navbar-simple">
            <NavbarList>
                <NavbarItem
                    path={"/add"}
                    label={"Ajout fichier"}
                    icon={"images/icons/add-file.svg"}
                    count={count_add}
                />
                <NavbarItem
                    path={"/bin"}
                    label={"poubelle"}
                    icon={"images/icons/trash-bin.svg"}
                    count={count_bin}
                />
                <NavbarItem
                    path={"/settings"}
                    label={"paramètres"}
                    icon={"images/icons/settings.svg"}
                    count={count_parametre}
                />
                <NavbarItem
                    path={"/"}
                    label={"télécharger"}
                    icon={"images/icons/download.svg"}
                    count={count_download}
                    onClick={onClick}
                />

            </NavbarList>
        </div>
    )
}

export default SimpleNavbar;

SimpleNavbar.propTypes = {
}