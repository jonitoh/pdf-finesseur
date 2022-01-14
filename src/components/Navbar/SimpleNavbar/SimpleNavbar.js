import React from 'react';
import PropTypes from 'prop-types';
import './SimpleNavbar.css';
import NavbarList from '../NavbarList/NavbarList';
import NavbarItem from '../NavbarItem/NavbarItem';

const SimpleNavbar = () => {
    // counts to be updated
    const count_add = 2;
    const count_bin = 0;
    const count_parametre = 0;
    const count_download = 0;

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
                    icon={"ressources/images/icons/actions-add-file-desktop-jld6gct-svgrepo-com.svg"}
                    count={count_add}
                />
                <NavbarItem
                    path={"/bin"}
                    label={"poubelle"}
                    icon={"ressources/images/icons/trash-bin-svgrepo-com.svg"}
                    count={count_bin}
                />
                <NavbarItem
                    path={"/settings"}
                    label={"paramètres"}
                    icon={"ressources/images/icons/settings-svgrepo-com.svg"}
                    count={count_parametre}
                />
                <NavbarItem
                    path={"/"}
                    label={"télécharger"}
                    icon={"ressources/images/icons/button-circle-round-arrow-down-svgrepo-com.svg"}
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